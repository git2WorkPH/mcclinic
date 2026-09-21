locals {
  root_principal  = "arn:aws:iam::${var.account_id}:root"
  kms_base_policy = { Version = "2012-10-17", Statement = [{ Sid = "AccountAdministration", Effect = "Allow", Principal = { AWS = local.root_principal }, Action = "kms:*", Resource = "*" }] }
}
resource "aws_kms_key" "storage" {
  description             = "${var.name} retained storage"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy                  = jsonencode(local.kms_base_policy)
  lifecycle { prevent_destroy = true }
}
resource "aws_kms_key" "identity" {
  description             = "${var.name} retained identity envelopes"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy                  = jsonencode(local.kms_base_policy)
  lifecycle { prevent_destroy = true }
}
resource "aws_db_subnet_group" "clinic" {
  name       = "${var.name}-db"
  subnet_ids = aws_subnet.private[*].id
}
resource "aws_db_parameter_group" "clinic" {
  name_prefix = "${var.name}-pg17-"
  family      = "postgres17"
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
}
resource "aws_db_instance" "clinic" {
  identifier                      = "${var.name}-db"
  engine                          = "postgres"
  engine_version                  = "17.6"
  instance_class                  = "db.t4g.micro"
  db_name                         = "mcclinic"
  username                        = "mcclinic_owner"
  manage_master_user_password     = true
  master_user_secret_kms_key_id   = aws_kms_key.storage.arn
  db_subnet_group_name            = aws_db_subnet_group.clinic.name
  parameter_group_name            = aws_db_parameter_group.clinic.name
  vpc_security_group_ids          = [aws_security_group.database.id]
  publicly_accessible             = false
  storage_encrypted               = true
  kms_key_id                      = aws_kms_key.storage.arn
  allocated_storage               = 20
  max_allocated_storage           = 40
  storage_type                    = "gp3"
  multi_az                        = false
  backup_retention_period         = 7
  delete_automated_backups        = false
  deletion_protection             = true
  copy_tags_to_snapshot           = true
  enabled_cloudwatch_logs_exports = ["postgresql"]
  skip_final_snapshot             = false
  final_snapshot_identifier       = "${var.name}-explicitly-approved-final-snapshot"
  lifecycle { prevent_destroy = true }
}
resource "aws_ecr_repository" "clinic" {
  name                 = var.name
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false
  image_scanning_configuration { scan_on_push = true }
  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = aws_kms_key.storage.arn
  }
  lifecycle { prevent_destroy = true }
}
resource "aws_s3_bucket" "web" {
  bucket        = "${var.name}-${var.account_id}-assets"
  force_destroy = false
  lifecycle { prevent_destroy = true }
}
resource "aws_s3_bucket_public_access_block" "web" {
  bucket                  = aws_s3_bucket.web.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_versioning" "web" {
  bucket = aws_s3_bucket.web.id
  versioning_configuration { status = "Enabled" }
}
resource "aws_s3_bucket_ownership_controls" "web" {
  bucket = aws_s3_bucket.web.id
  rule { object_ownership = "BucketOwnerEnforced" }
}
resource "aws_s3_bucket_server_side_encryption_configuration" "web" {
  bucket = aws_s3_bucket.web.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}
resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.id
  policy = jsonencode({ Version = "2012-10-17", Statement = [
    { Effect = "Deny", Principal = "*", Action = "s3:*", Resource = [aws_s3_bucket.web.arn, "${aws_s3_bucket.web.arn}/*"], Condition = { Bool = { "aws:SecureTransport" = "false" } } },
    { Effect = "Allow", Principal = { Service = "cloudfront.amazonaws.com" }, Action = "s3:GetObject", Resource = "${aws_s3_bucket.web.arn}/*", Condition = { StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.web.arn } } }
  ] })
}
resource "aws_cloudwatch_log_group" "api" {
  name = "/mcclinic/${var.name}"
  # No automatic log expiry or record purge.
  lifecycle { prevent_destroy = true }
}
resource "aws_security_group" "sink" {
  name_prefix = "${var.name}-efs-"
  vpc_id      = aws_vpc.clinic.id
  ingress {
    protocol        = "tcp"
    from_port       = 2049
    to_port         = 2049
    security_groups = [aws_security_group.runtime.id]
  }
  egress = []
}
resource "aws_efs_file_system" "sink" {
  creation_token = "${var.name}-synthetic-mailbox"
  encrypted      = true
  kms_key_id     = aws_kms_key.storage.arn
  lifecycle { prevent_destroy = true }
}
resource "aws_efs_backup_policy" "sink" {
  file_system_id = aws_efs_file_system.sink.id
  backup_policy { status = "ENABLED" }
}
resource "aws_efs_access_point" "sink" {
  file_system_id = aws_efs_file_system.sink.id
  posix_user {
    uid = 1000
    gid = 1000
  }
  root_directory {
    path = "/synthetic-identity"
    creation_info {
      owner_uid   = 1000
      owner_gid   = 1000
      permissions = "0700"
    }
  }
  lifecycle { prevent_destroy = true }
}
resource "aws_efs_mount_target" "sink" {
  count           = 2
  file_system_id  = aws_efs_file_system.sink.id
  subnet_id       = aws_subnet.private[count.index].id
  security_groups = [aws_security_group.sink.id]
}
resource "aws_efs_file_system_policy" "sink" {
  file_system_id = aws_efs_file_system.sink.id
  policy = jsonencode({ Version = "2012-10-17", Statement = [
    { Effect = "Deny", Principal = "*", Action = "elasticfilesystem:*", Resource = "*", Condition = { Bool = { "aws:SecureTransport" = "false" } } },
    { Effect = "Deny", Principal = "*", Action = ["elasticfilesystem:ClientMount", "elasticfilesystem:ClientWrite", "elasticfilesystem:ClientRootAccess"], Resource = "*", Condition = { StringNotEquals = { "aws:PrincipalArn" = [aws_iam_role.runtime.arn, aws_iam_role.mailbox.arn] } } }
  ] })
}
