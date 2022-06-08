variable "prefix" {
  default     = ""
  type        = string
  description = "Prefix prepended to the beginning of all names of created resources"
}

variable "suffix" {
  default     = ""
  type        = string
  description = "Suffix appended to the end of all names of created resources"
}

variable "notify_days" {
  default     = 25
  type        = number
  description = "Days since last access when we should notify users about deletion. NOTE: Notification is not on by default, see notification_config."
}

variable "delete_days" {
  default     = 30
  type        = number
  description = "Days since last access when we should delete the user"
}

variable "notification_config" {
  description = "Provide these values to enable notification. If not provided, notification is disabled."

  type = object({
    ses_domain_identity_arn = string       # Provide the ARN of the SES domain identity.
    contact                 = string       # Email address to include in the HTML email notification. Tells users to contact that email for further questions.
    from                    = string       # Mail FROM address
    reply_to                = string       # Mail reply-to address
    cc                      = list(string) # List of email addresses to CC on all notifications
  })

  default = null
}

variable "permissions_boundary_arn" {
  default     = null
  type        = string
  description = "If you need to attach a permissions boundary to a role, then give the ARN of the permissions boundary policy here"
}

variable "cron_expression" {
  default     = "cron(6 6 * * ? *)"
  type        = string
  description = "When to trigger the Lambda. See: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html"
}

variable "vpc_config" {
  description = "Provide these values to place the Lambda function in a VPC"

  type = object({
    security_group_ids = list(string)
    subnet_ids         = list(string)
  })

  default = null
}

variable "monitoring_alert_email_addresses" {
  description = "If provided, enables monitoring alert e-mails. Highly recommended in order to monitor the health of this module."
  type        = list(string)
  default     = []
}

variable "kms_key_arn" {
  description = "If provided, secures the Lambda environment variables with a KMS key"
  default     = null
}
