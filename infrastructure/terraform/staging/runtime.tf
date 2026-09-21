locals {
  runtime_env = {
    APP_ENV                    = "synthetic-staging"
    MVP_SYNTHETIC_ONLY         = "true"
    WEB_ORIGIN                 = "https://${var.domains.web}"
    DB_HOST                    = aws_db_instance.clinic.address
    DB_CA_PEM                  = var.database_ca_pem
    IDENTITY_SYNTHETIC_DOMAINS = "example.test"
  }
  logging = { logDriver = "awslogs", options = { awslogs-group = aws_cloudwatch_log_group.api.name, awslogs-region = "ap-southeast-1", awslogs-stream-prefix = "staging" } }
}
resource "aws_ecs_cluster" "clinic" {
  name = var.name
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
resource "aws_ecs_task_definition" "api" {
  family                   = "${var.name}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  task_role_arn            = aws_iam_role.runtime.arn
  execution_role_arn       = aws_iam_role.execution["runtime"].arn
  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }
  volume {
    name = "synthetic-state"
    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.sink.id
      transit_encryption = "ENABLED"
      authorization_config {
        access_point_id = aws_efs_access_point.sink.id
        iam             = "ENABLED"
      }
    }
  }
  container_definitions = jsonencode([{
    name             = "api", image = var.images.api, essential = true, user = "1000:1000", readonlyRootFilesystem = true,
    linuxParameters  = { capabilities = { drop = ["ALL"] } }, stopTimeout = 30,
    portMappings     = [{ containerPort = 4000, protocol = "tcp" }],
    mountPoints      = [{ sourceVolume = "synthetic-state", containerPath = "/var/lib/mcclinic", readOnly = false }],
    environment      = [for name, value in merge(local.runtime_env, { EHR_LOCAL_STATE_DIR = "/var/lib/mcclinic", IDENTITY_KMS_ALLOW_NETWORK = tostring(var.enable_network_custody) }) : { name = name, value = value }],
    secrets          = [for name, arn in { DB_RUNTIME_SECRET = var.secrets.runtime, IDENTITY_KMS_ENVELOPE = var.secrets.identity_envelope, STAGING_ORIGIN_SECRET = var.secrets.origin } : { name = name, valueFrom = arn }],
    logConfiguration = local.logging
  }])
}
resource "aws_ecs_service" "api" {
  name                               = "${var.name}-api"
  cluster                            = aws_ecs_cluster.clinic.id
  task_definition                    = aws_ecs_task_definition.api.arn
  desired_count                      = var.desired_count
  launch_type                        = "FARGATE"
  platform_version                   = "1.4.0"
  enable_execute_command             = false
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.runtime.id]
    assign_public_ip = false
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 4000
  }
  depends_on = [terraform_data.authorization, aws_lb_listener_rule.origin, aws_efs_mount_target.sink, aws_iam_role_policy.execution, aws_iam_role_policy.sink, aws_iam_role_policy.identity]
}
resource "aws_ecs_task_definition" "database" {
  for_each                 = { bootstrap = "bootstrap", migrator = "migrate" }
  family                   = "${var.name}-${each.key}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "1024"
  task_role_arn            = aws_iam_role.job.arn
  execution_role_arn       = aws_iam_role.execution[each.key].arn
  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }
  container_definitions = jsonencode([{
    name             = each.value, image = var.images.migration, user = "1000:1000", essential = true,
    command          = ["node", "apps/api/dist/apps/api/src/staging-command.js", each.value],
    linuxParameters  = { capabilities = { drop = ["ALL"] } },
    environment      = [for name, value in merge(local.runtime_env, { EHR_LOCAL_STATE_DIR = "/tmp/synthetic-job", STAGING_OPERATOR_JOB = "explicit-synthetic-job", STAGING_ORIGIN_SECRET = "database-job-no-http-listener-no-origin-access" }) : { name = name, value = value }],
    secrets          = concat([{ name = "DB_RUNTIME_SECRET", valueFrom = var.secrets.runtime }, { name = "DB_MIGRATOR_SECRET", valueFrom = var.secrets.migrator }], each.key == "bootstrap" ? [{ name = "DB_ADMIN_SECRET", valueFrom = local.secret_keys.admin.secret }] : []),
    logConfiguration = local.logging
  }])
}
resource "aws_ecs_task_definition" "mailbox" {
  family                   = "${var.name}-mailbox"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  task_role_arn            = aws_iam_role.mailbox.arn
  execution_role_arn       = aws_iam_role.execution["mailbox"].arn
  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }
  volume {
    name = "synthetic-state"
    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.sink.id
      transit_encryption = "ENABLED"
      authorization_config {
        access_point_id = aws_efs_access_point.sink.id
        iam             = "ENABLED"
      }
    }
  }
  container_definitions = jsonencode([{
    name             = "mailbox", image = var.images.mailbox, essential = true, user = "1000:1000", readonlyRootFilesystem = true,
    linuxParameters  = { capabilities = { drop = ["ALL"] } },
    environment      = [for name, value in { EHR_LOCAL_STATE_DIR = "/var/lib/mcclinic", APP_ENV = "synthetic-staging", MVP_SYNTHETIC_ONLY = "true", STAGING_OPERATOR_JOB = "explicit-synthetic-job" } : { name = name, value = value }],
    mountPoints      = [{ sourceVolume = "synthetic-state", containerPath = "/var/lib/mcclinic", readOnly = true }],
    logConfiguration = local.logging
  }])
}
