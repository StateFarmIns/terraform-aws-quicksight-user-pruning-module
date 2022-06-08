import { DeleteUserCommand, ListUsersCommand, QuickSightClient } from '@aws-sdk/client-quicksight'
import { QuickSightUser } from './QuickSightUser'

export class QuickSightUserManager {
	private awsAccountId = process.env.awsAccountId
	private static namespace = 'default'
	private quickSightClient = new QuickSightClient({})
  
	public async retrieveUsers(): Promise<QuickSightUser[]> {
		const quickSightUsers: QuickSightUser[] = []

		let nextToken = '' // originally I tried null, but it causes API signature issues.
		do {
			const listUsersCommand = new ListUsersCommand({ AwsAccountId: this.awsAccountId, Namespace: QuickSightUserManager.namespace, NextToken: nextToken })
			const quickSightUserListResponse = await this.quickSightClient.send(listUsersCommand)

			nextToken = quickSightUserListResponse.NextToken

			quickSightUserListResponse.UserList.forEach((user) => quickSightUsers.push(new QuickSightUser(user)))
		} while (nextToken)

		return quickSightUsers
	}

	public async deleteUser(user: QuickSightUser) {
		// Stryker disable next-line all "I do not care about mutating console statements"
		console.debug(`Deleting ${JSON.stringify(user, null, 1)}`)
		
		const deleteUserCommand = new DeleteUserCommand({
			AwsAccountId: this.awsAccountId,
			Namespace: QuickSightUserManager.namespace,
			UserName: user.username,
		})

		await this.quickSightClient.send(deleteUserCommand)
	}
}