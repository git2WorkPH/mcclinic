output "review" {
  description = "Non-secret resource identifiers; not authorization to activate."
  value = {
    vpc                    = aws_vpc.clinic.id
    private_subnets        = aws_subnet.private[*].id
    runtime_security_group = aws_security_group.runtime.id
    database_host          = aws_db_instance.clinic.address
    registry               = aws_ecr_repository.clinic.repository_url
    assets_bucket          = aws_s3_bucket.web.id
    distribution           = aws_cloudfront_distribution.web.id
    cluster                = aws_ecs_cluster.clinic.name
    service                = aws_ecs_service.api.name
    bootstrap_job          = aws_ecs_task_definition.database["bootstrap"].arn
    migration_job          = aws_ecs_task_definition.database["migrator"].arn
    mailbox_job            = aws_ecs_task_definition.mailbox.arn
    identity_key           = aws_kms_key.identity.arn
    alert_topic            = aws_sns_topic.alerts.arn
  }
}
