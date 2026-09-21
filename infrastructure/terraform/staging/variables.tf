variable "account_id" {
  type = string
  validation {
    condition     = can(regex("^[0-9]{12}$", var.account_id))
    error_message = "Supply the separately approved AWS account ID."
  }
}
variable "name" {
  type = string
  validation {
    condition     = can(regex("^mcclinic-tf-[a-z0-9-]{1,16}$", var.name))
    error_message = "Use a distinct mcclinic-tf- name; never overlap CloudFormation ownership."
  }
}
variable "provisioning_approved" {
  type    = bool
  default = false
}
variable "monthly_budget_usd" {
  type = number
  validation {
    condition     = var.monthly_budget_usd >= 1
    error_message = "An explicit approved budget is required; no free-tier assumption."
  }
}
variable "availability_zones" {
  type = list(string)
  validation {
    condition     = length(var.availability_zones) == 2 && length(toset(var.availability_zones)) == 2 && alltrue([for az in var.availability_zones : can(regex("^ap-southeast-1[a-z]$", az))])
    error_message = "Supply two distinct reviewed Singapore AZs."
  }
}
variable "s3_prefix_list_id" { type = string }
variable "cloudfront_prefix_list_id" { type = string }
variable "tester_cidrs" {
  type = list(string)
  validation {
    condition     = length(var.tester_cidrs) > 0 && alltrue([for cidr in var.tester_cidrs : can(cidrnetmask(cidr)) && try(tonumber(split("/", cidr)[1]) >= 24, false)])
    error_message = "Explicit tester IPv4 CIDRs /24 or narrower are required; world-open access is forbidden."
  }
}
variable "domains" {
  type = object({ web = string, origin = string, zone_id = string, edge_certificate_arn = string, origin_certificate_arn = string })
  validation {
    condition     = var.domains.web != var.domains.origin && can(regex("^[a-z0-9.-]+$", var.domains.web)) && can(regex("^[a-z0-9.-]+$", var.domains.origin)) && can(regex("^arn:aws:acm:us-east-1:[0-9]{12}:certificate/", var.domains.edge_certificate_arn)) && can(regex("^arn:aws:acm:ap-southeast-1:[0-9]{12}:certificate/", var.domains.origin_certificate_arn))
    error_message = "Use distinct HTTPS domains and certificates in their required regions."
  }
}
variable "images" {
  type = object({ api = string, migration = string, mailbox = string })
  validation {
    condition     = alltrue([for image in values(var.images) : can(regex("^[0-9]{12}\\.dkr\\.ecr\\.ap-southeast-1\\.amazonaws\\.com/.+@sha256:[a-f0-9]{64}$", image))])
    error_message = "All images must be separately reviewed immutable ARM64 ECR digests."
  }
}
variable "image_repository_arn" {
  type        = string
  description = "Exact existing ECR repository containing the approved three image digests. The new registry is retained for subsequent releases."
}
variable "secrets" {
  type = object({ runtime = string, migrator = string, identity_envelope = string, origin = string, runtime_key = string, migrator_key = string, integration_key = string })
  validation {
    condition     = alltrue([for k in ["runtime", "migrator", "identity_envelope", "origin"] : can(regex("^arn:aws:secretsmanager:ap-southeast-1:[0-9]{12}:secret:", var.secrets[k]))]) && var.secrets.runtime != var.secrets.migrator && alltrue([for k in ["runtime_key", "migrator_key", "integration_key"] : can(regex("^arn:aws:kms:ap-southeast-1:[0-9]{12}:key/", var.secrets[k]))])
    error_message = "Supply separate reviewed runtime/migrator secret ARNs and exact Singapore key ARNs, never plaintext database passwords."
  }
}
variable "origin_header_secret" {
  type        = string
  sensitive   = true
  description = "Must match the separately managed origin secret. Terraform stores this in state/plan despite redaction. Never commit it or read it from .env."
  validation {
    condition     = can(regex("^[A-Za-z0-9_-]{43,128}$", var.origin_header_secret))
    error_message = "An independently generated origin secret of 43–128 base64url characters is required."
  }
}
variable "database_ca_pem" {
  type = string
  validation {
    condition     = strcontains(var.database_ca_pem, "-----BEGIN CERTIFICATE-----")
    error_message = "Supply a dated verified public RDS CA bundle. Runtime checks certificate validity."
  }
}
variable "desired_count" {
  type    = number
  default = 0
  validation {
    condition     = contains([0, 1], var.desired_count)
    error_message = "Only zero or one synthetic staging service is supported."
  }
}
variable "enable_network_custody" {
  type    = bool
  default = false
}
resource "terraform_data" "authorization" {
  input = "synthetic-staging-only"
  lifecycle {
    prevent_destroy = true
    precondition {
      condition     = var.provisioning_approved
      error_message = "No AWS provisioning authorized. Obtain separate account/budget/operator approval; a flag alone is not permission."
    }
    precondition {
      condition     = var.desired_count == 0 || var.enable_network_custody
      error_message = "Service activation requires reviewed network key custody."
    }
  }
}
