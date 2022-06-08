locals {
  create_alarms = length(var.monitoring_alert_email_addresses) == 0 ? false : true
}

resource "aws_sns_topic" "alerts" {
  count = local.create_alarms ? 1 : 0
  name  = "${local.name}-alerting"
}

resource "aws_sns_topic_subscription" "alerts" {
  for_each  = toset(var.monitoring_alert_email_addresses)
  topic_arn = aws_sns_topic.alerts[0].arn
  protocol  = "email"
  endpoint  = each.value
}

resource "aws_cloudwatch_metric_alarm" "pruneQuickSightUsers_errors" {
  count               = local.create_alarms ? 1 : 0
  alarm_name          = "${local.name}-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Errors occurred invoking the lambda."
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts[0].arn]

  dimensions = {
    FunctionName = aws_lambda_function.quicksight_cleanup.function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "pruneQuickSightUsers_throttles" {
  count               = local.create_alarms ? 1 : 0
  alarm_name          = "${local.name}-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Maximum"
  threshold           = 0
  alarm_description   = "The Lambda has been throttled."
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts[0].arn]

  dimensions = {
    FunctionName = aws_lambda_function.quicksight_cleanup.function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "pruneQuickSightUsers_no_invocations" {
  count               = local.create_alarms ? 1 : 0
  alarm_name          = "${local.name}-no-invocations"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Invocations"
  namespace           = "AWS/Lambda"
  period              = (60 * 60 * 24) # 24 hours
  statistic           = "Maximum"
  threshold           = 1
  alarm_description   = "The Lambda has not been invoked in the last 24 hours."
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts[0].arn]

  dimensions = {
    FunctionName = aws_lambda_function.quicksight_cleanup.function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "pruneQuickSightUsers_invalid_users" {
  count               = local.create_alarms ? 1 : 0
  alarm_name          = "${local.name}-invalid-users"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "InvalidUsersCount"
  namespace           = aws_lambda_function.quicksight_cleanup.function_name
  period              = "300"
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Invalid users with N/A usernames are present in the account. It is a known AWS issue that these users cannot be removed via the API. Check CloudWatch Logs for the Lambda to see the invalid users, and delete them manually in the QuickSight UI."
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts[0].arn]
}
