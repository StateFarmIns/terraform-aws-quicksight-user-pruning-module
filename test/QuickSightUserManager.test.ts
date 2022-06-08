import { DeleteUserCommand, ListUsersCommand, QuickSightClient, User } from '@aws-sdk/client-quicksight'
import { mockClient } from 'aws-sdk-client-mock'
import { QuickSightUser } from '../src/QuickSightUser'
import { QuickSightUserManager } from '../src/QuickSightUserManager'

process.env.awsAccountId = '1234567890'

const quickSightUserManager: QuickSightUserManager = new QuickSightUserManager()
const quickSightMock = mockClient(QuickSightClient)
const validUsers: User[] = [ // User is a type from AWS SDK client
	{
		Active: true,
		Arn: 'arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-admin-role/john.smith@example.com',
		Email: 'john.smith@example.com',
		PrincipalId: 'federated/iam/ARIAGRGHRGGERHQWOJ:john.smith@example.com',
		UserName: 'quicksight-admin-role/john.smith@example.com',
		Role: 'ADMIN',
	},
	{
		Active: true,
		Arn: 'arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-author-role/jill.hill@example.com',
		Email: 'jill.hill@example.com',
		PrincipalId: 'federated/iam/ARIAGRGHTRHGERHQWOJ:jill.hill@example.com',
		UserName: 'quicksight-author-role/jill.hill@example.com',
		Role: 'AUTHOR',
	},
	{
		Active: true,
		Arn: 'arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-reader/lowly.reader@example.com',
		Email: 'lowly.reader@example.com',
		PrincipalId: 'federated/iam/ARIAGERHIGWFEHQOFIH:lowly.reader@example.com',
		UserName: 'quicksight-reader-role/lowly.reader@example.com',
		Role: 'READER',
	},
]

const validQuickSightUsers: QuickSightUser[] = validUsers.map((user) => new QuickSightUser(user)) // QuickSightUser is our custom type

afterEach(() => {
	quickSightMock.reset()
})

describe('QuickSightUserManager', () => {
	describe('retrieveUsers', () => {
		it('gets a valid one-page list of users', async () => {
			quickSightMock.on(ListUsersCommand).resolves({
				UserList: validUsers,
			})

			const users = await quickSightUserManager.retrieveUsers()

			expect(quickSightMock.calls()).toHaveLength(1)

			const expectedInput = { AwsAccountId: process.env.awsAccountId, Namespace: 'default', NextToken: '' }
			expect(quickSightMock.call(0).args[0].input).toStrictEqual(expectedInput)

			expect(users).toMatchSnapshot()
		})

		it('gets a valid two-page list of users', async () => {
			quickSightMock.on(ListUsersCommand).resolvesOnce({
				UserList: [validUsers[0]],
				NextToken: 'GetMoreResults',
			}).resolvesOnce({
				UserList: [validUsers[1]],
			})


			const users = await quickSightUserManager.retrieveUsers()

			expect(quickSightMock.calls()).toHaveLength(2)

			const expectedInput = { AwsAccountId: process.env.awsAccountId, Namespace: 'default', NextToken: '' }
			expect(quickSightMock.call(0).args[0].input).toStrictEqual(expectedInput)

			const secondExpectedInput = { ...expectedInput, NextToken: 'GetMoreResults' }
			expect(quickSightMock.call(1).args[0].input).toStrictEqual(secondExpectedInput)

			expect(users).toMatchSnapshot()
		})

		it('fails when receiving exception', async () => {
			const error: Error = { name: 'BadError', message: 'Oh no!' }
			quickSightMock.on(ListUsersCommand).rejects(error)

			await expect(quickSightUserManager.retrieveUsers()).rejects.toThrowError(error)
		})
	})

	describe('deleteUser', () => {
		it('successfully deletes a user', async () => {
			quickSightMock.on(DeleteUserCommand).resolves({})

			await quickSightUserManager.deleteUser(validQuickSightUsers[0])

			expect(quickSightMock.calls()).toHaveLength(1)

			const expectedInput = { AwsAccountId: process.env.awsAccountId, Namespace: 'default', UserName: validQuickSightUsers[0].username }
			expect(quickSightMock.call(0).args[0].input).toStrictEqual(expectedInput)
		})

		it('fails when receiving exception', async () => {
			const error: Error = { name: 'BadError', message: 'Oh no!' }
			quickSightMock.on(DeleteUserCommand).rejects(error)

			await expect(quickSightUserManager.deleteUser(validQuickSightUsers[0])).rejects.toThrowError(error)
		})
	})
})