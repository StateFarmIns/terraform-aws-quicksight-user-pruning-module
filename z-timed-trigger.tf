resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id   = "AllowExecutionFromCloudWatch"
  action         = "lambda:InvokeFunction"
  function_name  = aws_lambda_function.quicksight_cleanup.function_name
  principal      = "events.amazonaws.com"
  source_arn     = aws_cloudwatch_event_rule.daily.arn
  source_account = data.aws_caller_identity.current.account_id
}

resource "aws_cloudwatch_event_rule" "daily" {
  name                = local.name
  description         = "Daily execution of ${local.name} Lambda"
  schedule_expression = var.cron_expression
}

resource "aws_cloudwatch_event_target" "daily_lambda" {
  rule = aws_cloudwatch_event_rule.daily.name
  arn  = aws_lambda_function.quicksight_cleanup.arn
}
