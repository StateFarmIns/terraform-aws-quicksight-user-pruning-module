import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { QuickSightUser } from './QuickSightUser'

export class NotificationManager {
	private sesClient = new SESClient({})
	private noLastAccessDate = new Date(0).toLocaleString()

	public async notifyUser(user: QuickSightUser) {
		// Stryker disable next-line all "I do not care about mutating console statements"
		console.debug(`Notifying ${JSON.stringify(user, null, 1)}`)
		
		// If the date is 1970, we didn't find any activity for the user
		const lastAccess =
			user.lastAccess.toLocaleString() === this.noLastAccessDate
				? `not in the last ${process.env.deleteDays} days`
				: user.lastAccess.toLocaleDateString()

		const subject = `I: QuickSight user ${user.username} in account ${process.env.accountAlias} will be deleted`
		const body = `In order to <a href="https://aws.amazon.com/quicksight/pricing/">control costs ($24/month/user)</a>,
    your AWS QuickSight user '${user.username}' 
    will be deleted when you have not accessed QuickSight in ${process.env.deleteDays} days. 
    CloudTrail records indicate that your last access was ${lastAccess}.<br /><br />
    
    You can keep your user by logging in and taking actions in QuickSight. 
    Alternatively, you can do nothing, and your user will be automatically deleted. 
    Never fear, you simply log back into QuickSight and enter your e-mail, and your user gets recreated. 
    No dashboards or other resources will be deleted at this time (we may clean those up in the future, with notification, of course).<br /><br />
    
    Account Number: ${process.env.awsAccountId}<br />
    Account Alias: ${process.env.accountAlias}<br />
    Assumed Role: ${user.iamRole}<br />
    Email: ${user.email}<br /><br />
  
    For further assistance, contact <a href="mailto:${process.env.contact}">${process.env.contact}</a>. Thank you and have a fantastically fun-filled day 🥳.
    `

		const sendEmailCommand = new SendEmailCommand({
			Source: `${process.env.accountAlias} Cloud Account Administrator<${process.env.from}>`,
			Destination: {
				ToAddresses: [user.email],
				CcAddresses: JSON.parse(process.env.cc),
			},
			ReplyToAddresses: [process.env.replyTo],
			SourceArn: process.env.sesArn,
			Message: {
				Subject: { Data: subject },
				Body: {
					Html: { Data: body },
				},
			},
		})

		await this.sesClient.send(sendEmailCommand)
	}
}