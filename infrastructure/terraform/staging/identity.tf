locals {
  task_trust = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Action = "sts:AssumeRole", Principal = { Service = "ecs-tasks.amazonaws.com" }, Condition = { StringEquals = { "aws:SourceAccount" = var.account_id }, ArnLike = { "aws:SourceArn" = "arn:aws:ecs:ap-southeast-1:${var.account_id}:*" } } }] })
  pull_log = [
    { Effect = "Allow", Action = ["ecr:GetAuthorizationToken"], Resource = ["*"] },
    { Effect = "Allow", Action = ["ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer", "ecr:BatchCheckLayerAvailability"], Resource = [var.image_repository_arn] },
    { Effect = "Allow", Action = ["logs:CreateLogStream", "logs:PutLogEvents"], Resource = ["${aws_cloudwatch_log_group.api.arn}:*"] }
  ]
  secret_keys = {
    runtime  = { secret = var.secrets.runtime, key = var.secrets.runtime_key }
    migrator = { secret = var.secrets.migrator, key = var.secrets.migrator_key }
    identity = { secret = var.secrets.identity_envelope, key = var.secrets.integration_key }
    origin   = { secret = var.secrets.origin, key = var.secrets.integration_key }
    admin    = { secret = aws_db_instance.clinic.master_user_secret[0].secret_arn, key = aws_kms_key.storage.arn }
  }
  execution_secrets = {
    runtime   = ["runtime", "identity", "origin"]
    migrator  = ["runtime", "migrator"]
    bootstrap = ["runtime", "migrator", "admin"]
    mailbox   = []
  }
}
resource "aws_iam_role" "runtime" {
  name               = "${var.name}-runtime"
  assume_role_policy = local.task_trust
}
resource "aws_iam_role" "mailbox" {
  name               = "${var.name}-mailbox"
  assume_role_policy = local.task_trust
}
resource "aws_iam_role" "job" {
  name               = "${var.name}-db-job"
  assume_role_policy = local.task_trust
}
resource "aws_iam_role" "execution" {
  for_each           = local.execution_secrets
  name               = "${var.name}-${each.key}-execution"
  assume_role_policy = local.task_trust
}
resource "aws_iam_role_policy" "execution" {
  for_each = local.execution_secrets
  name     = "pull-logs-exact-secrets"
  role     = aws_iam_role.execution[each.key].id
  policy = jsonencode({ Version = "2012-10-17", Statement = concat(local.pull_log, flatten([for name in each.value : [
    { Effect = "Allow", Action = ["secretsmanager:GetSecretValue"], Resource = [local.secret_keys[name].secret] },
    { Effect = "Allow", Action = ["kms:Decrypt"], Resource = [local.secret_keys[name].key], Condition = { StringEquals = { "kms:ViaService" = "secretsmanager.ap-southeast-1.amazonaws.com", "kms:EncryptionContext:SecretARN" = local.secret_keys[name].secret } } }
  ]])) })
}
resource "aws_iam_role_policy" "identity" {
  role   = aws_iam_role.runtime.id
  name   = "identity-unwrap-only"
  policy = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Action = ["kms:Decrypt"], Resource = [aws_kms_key.identity.arn], Condition = { StringEquals = { "kms:EncryptionContext:application" = "mcclinic-identity", "kms:EncryptionContext:environment" = "synthetic-staging" } } }] })
}
resource "aws_iam_role_policy" "sink" {
  for_each = { runtime = aws_iam_role.runtime.id, mailbox = aws_iam_role.mailbox.id }
  role     = each.value
  name     = "synthetic-sink"
  policy   = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Action = each.key == "runtime" ? ["elasticfilesystem:ClientMount", "elasticfilesystem:ClientWrite"] : ["elasticfilesystem:ClientMount"], Resource = [aws_efs_file_system.sink.arn], Condition = { StringEquals = { "elasticfilesystem:AccessPointArn" = aws_efs_access_point.sink.arn }, Bool = { "aws:SecureTransport" = "true" } } }] })
}
