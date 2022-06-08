import { CloudTrailUserEventManager } from './CloudTrailUserEventManager'
import { CloudWatchMetricClient } from './CloudWatchMetricClient'
import { NotificationManager } from './NotificationManager'
import { QuickSightRole } from './QuickSightUser'
import { QuickSightUserManager } from './QuickSightUserManager'

export default async () => {
	const { deleteDays, notifyDays } = process.env
	const enableNotification = process.env.enableNotification === 'true'
	const deleteDate = new Date()
	const notifyDate = new Date()
	deleteDate.setDate(deleteDate.getDate() - parseInt(deleteDays))
	notifyDate.setDate(notifyDate.getDate() - parseInt(notifyDays))

	// Stryker disable next-line all "I do not care about mutating console statements"
	console.info(`Notifying users with last access date on: ${notifyDate.toLocaleDateString()} (${notifyDays} days ago).`)
	// Stryker disable next-line all "I do not care about mutating console statements"
	console.info(`Deleting users with last access date on or before: ${deleteDate.toLocaleDateString()} (${deleteDays} days ago).`)
	// Stryker disable next-line all "I do not care about mutating console statements"
	console.info(`Notification enabled? ${enableNotification}.`)

	const quickSightUserManager = new QuickSightUserManager()
	const cloudTrailUserEventManager = new CloudTrailUserEventManager()
	const notificationManager = new NotificationManager()
	const cloudWatchMetricClient = new CloudWatchMetricClient()

	const quickSightUsers = await quickSightUserManager.retrieveUsers()
	const cloudTrailUserEvents = await cloudTrailUserEventManager.retrieveQuickSightUserEvents(deleteDate)

	for (const quickSightUser of quickSightUsers) {
		quickSightUser.lastAccess = cloudTrailUserEventManager.getLastAccessDate(quickSightUser, cloudTrailUserEvents)
	}

	// Stryker disable next-line all "I do not care about mutating console statements"
	console.debug(`QuickSight Users:\n${JSON.stringify(quickSightUsers, null, 2)}`)
	cloudWatchMetricClient.queueMetric({ MetricName: 'PriorQuickSightUsersCount', Value: quickSightUsers.length })

	let invalidUsers = 0
	let usersDeleted = 0
	let notificationsSent = 0

	for (const quickSightUser of quickSightUsers) {
		if (quickSightUser.invalid) { // Some QS users cannot be deleted VIA the API/SDK. See README for details
			// Stryker disable next-line all "I do not care about mutating console statements"
			console.warn(`Invalid user: ${JSON.stringify(quickSightUser)}`)
			invalidUsers++
		} else if (quickSightUser.lastAccess < deleteDate) {
			usersDeleted++
			await quickSightUserManager.deleteUser(quickSightUser)
		} else if (enableNotification
      && quickSightUser.role !== QuickSightRole.READER // Readers get into QuickSight through a public page and probably have no idea what QuickSight is. Therefore we shouldn't email them.
      && quickSightUser.lastAccess.toLocaleDateString() === notifyDate.toLocaleDateString()) { // toLocaleDateString strips off the time. If the day matches the notify "day" then we notify the user
			notificationsSent++
			await notificationManager.notifyUser(quickSightUser)
		}
	}

	cloudWatchMetricClient.queueMetric({ MetricName: 'InvalidUsersCount', Value: invalidUsers })
	cloudWatchMetricClient.queueMetric({ MetricName: 'UsersDeletedCount', Value: usersDeleted })
	cloudWatchMetricClient.queueMetric({ MetricName: 'NotificationsSentCount', Value: notificationsSent })
	cloudWatchMetricClient.queueMetric({ MetricName: 'RemainingQuickSightUsersCount', Value: quickSightUsers.length - usersDeleted })
	await cloudWatchMetricClient.emitQueuedMetrics()
}
