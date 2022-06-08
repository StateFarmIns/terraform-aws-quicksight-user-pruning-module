locals {
  prune_quicksight_users_file_name = "pruneQuickSightUsers"
}

resource "aws_cloudwatch_log_group" "quicksight_cleanup" {
  name              = "/aws/lambda/${local.name}"
  retention_in_days = 90
}

data "archive_file" "quicksight_cleanup" {
  type        = "zip"
  source_file = "${path.module}/${local.prune_quicksight_users_file_name}.js"
  output_path = "${path.module}/${local.prune_quicksight_users_file_name}.zip"
}

resource "aws_lambda_function" "quicksight_cleanup" {
  depends_on       = [aws_cloudwatch_log_group.quicksight_cleanup] # Log group must be created before Lambda or we may run into errors
  function_name    = local.name
  description      = "Runs daily (by default) to prune inactive users from QuickSight, saving you money."
  filename         = data.archive_file.quicksight_cleanup.output_path
  source_code_hash = data.archive_file.quicksight_cleanup.output_base64sha256
  runtime          = "nodejs16.x"
  handler          = "${local.prune_quicksight_users_file_name}.default"
  role             = aws_iam_role.quicksight_cleanup.arn
  timeout          = 900
  memory_size      = 512       # Probably too big, but I want to keep it bigger in case someone's account is massive
  architectures    = ["arm64"] # Cost savings
  kms_key_arn      = var.kms_key_arn

  dynamic "vpc_config" {
    for_each = var.vpc_config == null ? [] : ["make this block once"]

    content {
      security_group_ids = var.vpc_config.security_group_ids
      subnet_ids         = var.vpc_config.subnet_ids
    }
  }

  environment {
    variables = {
      awsAccountId       = data.aws_caller_identity.current.account_id
      accountAlias       = data.aws_iam_account_alias.current.account_alias
      deleteDays         = var.delete_days
      notifyDays         = var.notify_days
      enableNotification = local.enable_notification ? true : false
      contact            = local.enable_notification ? var.notification_config.contact : null
      replyTo            = local.enable_notification ? var.notification_config.reply_to : null
      cc                 = local.enable_notification ? jsonencode(var.notification_config.cc) : null
      from               = local.enable_notification ? var.notification_config.from : null
      sesArn             = local.enable_notification ? var.notification_config.ses_domain_identity_arn : null
    }
  }
}

resource "aws_iam_role" "quicksight_cleanup" {
  name                 = local.name
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume.json
  permissions_boundary = var.permissions_boundary_arn

  inline_policy {
    name   = local.name
    policy = data.aws_iam_policy_document.quicksight_cleanup.json
  }
}

data "aws_iam_policy_document" "quicksight_cleanup" {
  statement {
    sid       = "LogStreamCreation"
    actions   = ["logs:CreateLogStream"]
    resources = [aws_cloudwatch_log_group.quicksight_cleanup.arn]
  }

  statement {
    sid       = "PutLogs"
    actions   = ["logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.quicksight_cleanup.arn}:log-stream:*"]
  }

  statement {
    actions   = ["ec2:CreateNetworkInterface", "ec2:DeleteNetworkInterface", "ec2:DescribeNetworkInterfaces"]
    resources = ["*"]
  }

  statement {
    actions   = ["CloudTrail:LookupEvents"]
    resources = ["*"]
  }

  statement {
    actions   = ["quicksight:ListUsers", "quicksight:DeleteUser"]
    resources = ["*"]
  }

  dynamic "statement" {
    for_each = local.enable_notification ? ["make this block once"] : []

    content {
      actions   = ["ses:SendEmail"]
      resources = [var.notification_config.ses_domain_identity_arn]
    }
  }

  statement {
    actions   = ["cloudwatch:PutMetricData"]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "cloudwatch:namespace"
      values   = [local.name]
    }
  }
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
