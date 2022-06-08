terraform {
  required_version = ">= 0.15"
  required_providers {
    archive = {
      source = "hashicorp/archive"
      version = ">= 4.15.0" # 4.15.0 introduced NodeJS 16.x
    }

    aws = {
      source = "hashicorp/aws"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_iam_account_alias" "current" {}

locals {
  name                = "${var.prefix}quicksight-user-cleanup${var.suffix}"
  enable_notification = var.notification_config == null ? false : true
}
