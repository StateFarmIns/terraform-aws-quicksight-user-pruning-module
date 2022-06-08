import { CloudTrailClient, LookupEventsCommand } from '@aws-sdk/client-cloudtrail'
import { CloudTrailUserEvent } from './CloudTrailUserEvent'
import { QuickSightUser } from './QuickSightUser'

export class CloudTrailUserEventManager {
	private cloudTrailClient = new CloudTrailClient({})

	// Filters out events that do not originate with someone's e-mail address
	// such as any automated process which touches QuickSight, including this one
	public async retrieveQuickSightUserEvents(startDate: Date): Promise<CloudTrailUserEvent[]> {
		const events: CloudTrailUserEvent[] = []

		let nextToken: string = null // This is annoying; null doesn't work in the QuickSight API but empty string doesn't work in the CloudTrail API
		do {
			const lookupEventsCommand = new LookupEventsCommand({
				LookupAttributes: [
					{
						AttributeKey: 'EventSource',
						AttributeValue: 'quicksight.amazonaws.com',
					},
				],
				StartTime: startDate,
				NextToken: nextToken,
			})

			const lookupEventsResult = await this.cloudTrailClient.send(lookupEventsCommand)

			nextToken = lookupEventsResult.NextToken

			lookupEventsResult.Events.forEach((event) => events.push(new CloudTrailUserEvent(event)))
		} while (nextToken)

		return events
	}

	public getLastAccessDate(user: QuickSightUser, events: CloudTrailUserEvent[]): Date {
		const thisParticularUserEvents = events.filter((event) => user.iamRole === event.iamRole && user.stsSession === event.stsSession)

		if (thisParticularUserEvents.length === 0) {
			// Stryker disable next-line all "I do not care about mutating console statements"
			console.debug(`${user.iamRole}/${user.stsSession} no CloudTrail events found`)
			return new Date(0) // Return 1970 as last access date to make logic easier down the road
		}

		// Sort newest to oldest
		const newestEvent = thisParticularUserEvents.sort((a, b) => a.eventTime <= b.eventTime ? 1 : -1)[0]
		// Stryker disable next-line all "I do not care about mutating console statements"
		console.debug(`${user.iamRole}/${user.stsSession} latest event: ${JSON.stringify(newestEvent, null, 1)}`)

		return newestEvent.eventTime
	}
}