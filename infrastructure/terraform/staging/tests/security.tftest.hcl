mock_provider "aws" {
  mock_resource "aws_cloudfront_cache_policy" { defaults = { id = "11111111-1111-4111-8111-111111111111" } }
  mock_resource "aws_cloudfront_origin_request_policy" { defaults = { id = "22222222-2222-4222-8222-222222222222" } }
  override_during = plan
  mock_resource "aws_vpc" { defaults = { "id" : "vpc-0123456789abcdef0" } }
  mock_resource "aws_subnet" { defaults = { "id" : "subnet-0123456789abcdef0" } }
  mock_resource "aws_security_group" { defaults = { "id" : "sg-0123456789abcdef0" } }
  mock_resource "aws_kms_key" { defaults = { "arn" : "arn:aws:kms:ap-southeast-1:123456789012:key/11111111-1111-4111-8111-111111111111" } }
  mock_resource "aws_db_instance" { defaults = { "address" : "synthetic-db.example.test", "master_user_secret" : [{ "secret_arn" : "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:synthetic-admin-123456", "kms_key_id" : "arn:aws:kms:ap-southeast-1:123456789012:key/11111111-1111-4111-8111-111111111111", "secret_status" : "active" }] } }
  mock_resource "aws_iam_role" { defaults = { "arn" : "arn:aws:iam::123456789012:role/synthetic-task" } }
  mock_resource "aws_cloudwatch_log_group" { defaults = { "arn" : "arn:aws:logs:ap-southeast-1:123456789012:log-group:synthetic" } }
  mock_resource "aws_efs_file_system" { defaults = { "id" : "fs-0123456789abcdef0", "arn" : "arn:aws:elasticfilesystem:ap-southeast-1:123456789012:file-system/fs-0123456789abcdef0" } }
  mock_resource "aws_efs_access_point" { defaults = { "id" : "fsap-0123456789abcdef0", "arn" : "arn:aws:elasticfilesystem:ap-southeast-1:123456789012:access-point/fsap-0123456789abcdef0" } }
  mock_resource "aws_lb" { defaults = { "arn" : "arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:loadbalancer/app/synthetic/1234567890123456", "arn_suffix" : "app/synthetic/1234567890123456", "dns_name" : "synthetic.elb.example.test", "zone_id" : "Z123456789" } }
  mock_resource "aws_lb_target_group" { defaults = { "arn" : "arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/synthetic/1234567890123456", "arn_suffix" : "targetgroup/synthetic/1234567890123456" } }
  mock_resource "aws_lb_listener" { defaults = { "arn" : "arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:listener/app/synthetic/1234567890123456/1234567890123456" } }
  mock_resource "aws_s3_bucket" { defaults = { "arn" : "arn:aws:s3:::mcclinic-tf-test-123456789012-assets", "bucket_regional_domain_name" : "synthetic.s3.ap-southeast-1.amazonaws.com" } }
  mock_resource "aws_cloudfront_distribution" { defaults = { "arn" : "arn:aws:cloudfront::123456789012:distribution/ESYNTHETIC", "domain_name" : "synthetic.cloudfront.net", "hosted_zone_id" : "Z2FDTNDATAQYW2" } }
  mock_resource "aws_cloudfront_function" { defaults = { "arn" : "arn:aws:cloudfront::123456789012:function/synthetic" } }
  mock_resource "aws_sns_topic" { defaults = { "arn" : "arn:aws:sns:ap-southeast-1:123456789012:synthetic" } }
  mock_resource "aws_ecs_cluster" { defaults = { "id" : "arn:aws:ecs:ap-southeast-1:123456789012:cluster/synthetic" } }
  mock_resource "aws_ecs_task_definition" { defaults = { "arn" : "arn:aws:ecs:ap-southeast-1:123456789012:task-definition/synthetic:1" } }
}
mock_provider "aws" {
  alias           = "edge"
  override_during = plan
  mock_resource "aws_wafv2_ip_set" { defaults = { arn = "arn:aws:wafv2:us-east-1:123456789012:global/ipset/synthetic/11111111-1111-4111-8111-111111111111" } }
  mock_resource "aws_wafv2_web_acl" { defaults = { arn = "arn:aws:wafv2:us-east-1:123456789012:global/webacl/synthetic/11111111-1111-4111-8111-111111111111" } }
}
variables {
  account_id                = "123456789012"
  name                      = "mcclinic-tf-test"
  provisioning_approved     = true
  monthly_budget_usd        = 100
  availability_zones        = ["ap-southeast-1a", "ap-southeast-1b"]
  s3_prefix_list_id         = "pl-12345678"
  cloudfront_prefix_list_id = "pl-87654321"
  tester_cidrs              = ["203.0.113.10/32"]
  domains                   = { "web" : "clinic.example.test", "origin" : "origin.example.test", "zone_id" : "Z123456789", "edge_certificate_arn" : "arn:aws:acm:us-east-1:123456789012:certificate/11111111-1111-4111-8111-111111111111", "origin_certificate_arn" : "arn:aws:acm:ap-southeast-1:123456789012:certificate/11111111-1111-4111-8111-111111111111" }
  images                    = { "api" : "123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/synthetic@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "migration" : "123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/synthetic@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "mailbox" : "123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/synthetic@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
  image_repository_arn      = "arn:aws:ecr:ap-southeast-1:123456789012:repository/synthetic"
  secrets                   = { "runtime" : "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:synthetic-runtime-123456", "migrator" : "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:synthetic-migrator-123456", "identity_envelope" : "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:synthetic-identity_envelope-123456", "origin" : "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:synthetic-origin-123456", "runtime_key" : "arn:aws:kms:ap-southeast-1:123456789012:key/11111111-1111-4111-8111-111111111111", "migrator_key" : "arn:aws:kms:ap-southeast-1:123456789012:key/11111111-1111-4111-8111-111111111111", "integration_key" : "arn:aws:kms:ap-southeast-1:123456789012:key/11111111-1111-4111-8111-111111111111" }
  origin_header_secret      = "synthetic-only-never-use-this-example-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  database_ca_pem           = "-----BEGIN CERTIFICATE-----\nsynthetic mock value, not an actual CA\n-----END CERTIFICATE-----"
}
run "private_synthetic_plan" {
  command = plan
  assert {
    condition     = !aws_db_instance.clinic.publicly_accessible && aws_db_instance.clinic.storage_encrypted && aws_db_instance.clinic.deletion_protection && !aws_db_instance.clinic.delete_automated_backups && aws_db_instance.clinic.db_name == "mcclinic" && aws_db_instance.clinic.manage_master_user_password
    error_message = "RDS must remain private/encrypted/managed-password and deletion protected."
  }
  assert {
    condition     = aws_ecs_service.api.desired_count == 0 && !aws_ecs_service.api.network_configuration[0].assign_public_ip && !aws_ecs_service.api.enable_execute_command
    error_message = "Runtime must remain inactive/private with no shell access by default."
  }
  assert {
    condition     = alltrue([for subnet in aws_subnet.private : !subnet.map_public_ip_on_launch]) && length(aws_vpc_endpoint.services) == 5 && alltrue([for ep in aws_vpc_endpoint.services : ep.private_dns_enabled]) && length(aws_route_table.private.route) == 0
    error_message = "Private subnets must have endpoint-only access and no default internet route."
  }
  assert {
    condition     = aws_cloudfront_cache_policy.none.min_ttl == 0 && aws_cloudfront_cache_policy.none.default_ttl == 0 && aws_cloudfront_cache_policy.none.max_ttl == 0 && alltrue([for e in aws_cloudfront_distribution.web.custom_error_response : e.error_caching_min_ttl == 0])
    error_message = "Never cache clinical responses or errors."
  }
  assert {
    condition     = alltrue([for b in aws_cloudfront_distribution.web.ordered_cache_behavior : b.viewer_protocol_policy == "https-only" && b.cache_policy_id == aws_cloudfront_cache_policy.none.id && b.origin_request_policy_id == aws_cloudfront_origin_request_policy.api.id]) && aws_cloudfront_origin_request_policy.api.cookies_config[0].cookie_behavior == "all" && aws_cloudfront_origin_request_policy.api.headers_config[0].header_behavior == "allExcept"
    error_message = "API behaviors must preserve cookies and use no caching over HTTPS."
  }
  assert {
    condition     = length(aws_wafv2_web_acl.testers.default_action[0].block) == 1 && !aws_wafv2_web_acl.testers.visibility_config[0].sampled_requests_enabled && alltrue([for r in aws_wafv2_web_acl.testers.rule : !r.visibility_config[0].sampled_requests_enabled])
    error_message = "WAF must deny unlisted visitors and avoid payload samples."
  }
  assert {
    condition     = aws_lb_listener.api.default_action[0].fixed_response[0].status_code == "403" && aws_lb_listener.api.protocol == "HTTPS" && aws_lb.api.enable_deletion_protection
    error_message = "Direct ALB origin must reject unverified requests."
  }
  assert {
    condition     = aws_s3_bucket_public_access_block.web.block_public_acls && aws_s3_bucket_public_access_block.web.block_public_policy && aws_s3_bucket_public_access_block.web.ignore_public_acls && aws_s3_bucket_public_access_block.web.restrict_public_buckets && !aws_s3_bucket.web.force_destroy && aws_s3_bucket_versioning.web.versioning_configuration[0].status == "Enabled" && !aws_ecr_repository.clinic.force_delete
    error_message = "Artifacts must remain private, versioned and retained."
  }
  assert {
    condition     = aws_efs_file_system.sink.encrypted && aws_efs_backup_policy.sink.backup_policy[0].status == "ENABLED" && aws_efs_access_point.sink.root_directory[0].creation_info[0].permissions == "0700"
    error_message = "Synthetic identity mailbox must retain encrypted/private durable state."
  }
  assert {
    condition     = jsondecode(aws_ecs_task_definition.api.container_definitions)[0].readonlyRootFilesystem && jsondecode(aws_ecs_task_definition.api.container_definitions)[0].user == "1000:1000" && length(jsondecode(aws_ecs_task_definition.api.container_definitions)[0].secrets) == 3 && !strcontains(aws_ecs_task_definition.api.container_definitions, "DB_ADMIN_SECRET")
    error_message = "Runtime must not receive the owner or migrator secret."
  }
  assert {
    condition     = !strcontains(aws_iam_role_policy.execution["migrator"].policy, "synthetic-admin") && !strcontains(aws_ecs_task_definition.database["migrator"].container_definitions, "DB_ADMIN_SECRET") && strcontains(aws_ecs_task_definition.database["bootstrap"].container_definitions, "DB_ADMIN_SECRET")
    error_message = "Only the explicit bootstrap job may retrieve owner credentials."
  }
  assert {
    condition     = !strcontains(aws_iam_role_policy.execution["mailbox"].policy, "secretsmanager") && !strcontains(aws_iam_role_policy.sink["mailbox"].policy, "ClientWrite") && jsondecode(aws_ecs_task_definition.mailbox.container_definitions)[0].mountPoints[0].readOnly && jsondecode(aws_ecs_task_definition.mailbox.container_definitions)[0].readonlyRootFilesystem
    error_message = "Mailbox retrieval must stay read-only without database secrets."
  }
  assert {
    condition     = toset([for n in aws_budgets_budget.clinic.notification : n.threshold]) == toset([50, 80, 100]) && alltrue([for n in aws_budgets_budget.clinic.notification : length(coalesce(n.subscriber_email_addresses, toset([]))) == 0])
    error_message = "Keep explicit budget thresholds with no automatic external email."
  }
}
run "reject_unapproved_provisioning" {
  command = plan
  variables { provisioning_approved = false }
  expect_failures = [terraform_data.authorization]
}
run "reject_public_testers" {
  command = plan
  variables { tester_cidrs = ["0.0.0.0/0"] }
  expect_failures = [var.tester_cidrs]
}
run "reject_activation_without_custody" {
  command = plan
  variables { desired_count = 1 }
  expect_failures = [terraform_data.authorization]
}
run "reject_mutable_image" {
  command = plan
  variables {
    images = { api = "unreviewed:latest", migration = "unreviewed:latest", mailbox = "unreviewed:latest" }
  }
  expect_failures = [var.images]
}
run "reject_shared_database_secret" {
  command = plan
  variables {
    secrets = {
      runtime           = "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:same-123456"
      migrator          = "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:same-123456"
      identity_envelope = "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:identity-123456"
      origin            = "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:origin-123456"
      runtime_key       = "arn:aws:kms:ap-southeast-1:123456789012:key/synthetic"
      migrator_key      = "arn:aws:kms:ap-southeast-1:123456789012:key/synthetic"
      integration_key   = "arn:aws:kms:ap-southeast-1:123456789012:key/synthetic"
    }
  }
  expect_failures = [var.secrets]
}
run "reject_missing_budget" {
  command = plan
  variables { monthly_budget_usd = 0 }
  expect_failures = [var.monthly_budget_usd]
}
run "reject_wrong_region" {
  command = plan
  variables { availability_zones = ["us-east-1a", "us-east-1b"] }
  expect_failures = [var.availability_zones]
}
run "reject_weak_origin_secret" {
  command = plan
  variables { origin_header_secret = "weak" }
  expect_failures = [var.origin_header_secret]
}
