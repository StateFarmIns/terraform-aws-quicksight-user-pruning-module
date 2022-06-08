output "lambda_arn" {
  description = "Full ARN of the cleanup Lambda function"
  value       = aws_lambda_function.quicksight_cleanup.arn
}

output "lambda_name" {
  description = "Name of the cleanup Lambda function"
  value       = aws_lambda_function.quicksight_cleanup.function_name
}
