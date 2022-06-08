import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { mockClient } from 'aws-sdk-client-mock'
import { NotificationManager } from '../src/NotificationManager'
import { QuickSightRole, QuickSightUser } from '../src/QuickSightUser'

process.env = {
	...process.env,
	awsAccountId: '1234567890',
	accountAlias: 'MyAccountAlias',
	contact: 'contact@example.com',
	from: 'from@example.com',
	cc: JSON.stringify(['cc1@example.com', 'cc2@example.com']),
	replyTo: 'replyTo@example.com',
	sesArn: 'arn:aws:ses:us-east-1:1234567890:identity/example.com',
	deleteDays: '30',
}

const notificationManager = new NotificationManager()
const sesClientMock = mockClient(SESClient)

const validQuickSightUser: QuickSightUser = {
	arn: 'arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-admin-role/john.smith@example.com',
	email: 'john.smith@example.com',
	role: QuickSightRole.ADMIN,
	username: 'quicksight-admin-role/john.smith@example.com',
	iamRole: 'quicksight-admin-role',
	stsSession: 'john.smith@example.com',
	invalid: false,
	lastAccess: new Date('2022-05-09T01:02:03'),
}

const userNotAccessedRecently = { ...validQuickSightUser, lastAccess: new Date(0) }

afterEach(() => {
	sesClientMock.reset()
})

describe('NotificationManager', () => {
	describe('successful when', () => {
		it('gets a valid user', async () => {
			sesClientMock.on(SendEmailCommand).resolves({})

			await notificationManager.notifyUser(validQuickSightUser)

			expect(sesClientMock.calls()).toHaveLength(1)
			expect(sesClientMock.call(0).args[0].input).toMatchSnapshot()
		})

		it('gets a user who has not accessed QS recently', async () => {
			sesClientMock.on(SendEmailCommand).resolves({})

			await notificationManager.notifyUser(userNotAccessedRecently)

			expect(sesClientMock.calls()).toHaveLength(1)
			expect(sesClientMock.call(0).args[0].input).toMatchSnapshot()
		})
	})

	describe('fails when', () => {
		// Intentionally we don't handle errors in the Lambda, so just checking to make sure that it bubbles up the exception
		it('receives a SES client error', async () => {
			const error: Error = { name: 'MyError', message: 'Oh no!' }
			sesClientMock.on(SendEmailCommand).rejects(error)

			await expect(notificationManager.notifyUser(validQuickSightUser)).rejects.toThrowError(error)
		})
	})
})