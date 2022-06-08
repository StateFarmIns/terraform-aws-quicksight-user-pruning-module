import { Event } from '@aws-sdk/client-cloudtrail'

export class CloudTrailUserEvent {
	iamRole: string 
	stsSession: string 
	eventTime: Date

	constructor(event: Event) {
		const cloudTrailEvent = JSON.parse(event.CloudTrailEvent)
		const [role, session] =  cloudTrailEvent.userIdentity.arn.split('/').slice(1) // arn:aws:sts::account:assumed-role/ROLE_NAME/SESSION_NAME - may have undefined session if IAM user is used to login
		
		this.iamRole = role
		this.stsSession = session
		this.eventTime = event.EventTime
	}
}