terraform {
  required_version = "= 1.14.9"
  required_providers {
    aws = { source = "hashicorp/aws", version = "= 6.65.0" }
  }
  # No backend is provisioned here. Local state is ignored; an approved encrypted,
  # versioned and locked remote backend is a prerequisite to any real apply.
}
provider "aws" {
  region              = "ap-southeast-1"
  allowed_account_ids = [var.account_id]
  default_tags { tags = { application = "mcclinic", environment = "synthetic-staging", owner = "terraform" } }
}
provider "aws" {
  alias               = "edge"
  region              = "us-east-1"
  allowed_account_ids = [var.account_id]
  default_tags { tags = { application = "mcclinic", environment = "synthetic-staging", owner = "terraform" } }
}
