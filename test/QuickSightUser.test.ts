import { User } from '@aws-sdk/client-quicksight'
import { QuickSightUser } from '../src/QuickSightUser'

const validUser: User = {
	Active: true,
	Arn: 'arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-admin-role/john.smith@example.com',
	Email: 'john.smith@example.com',
	PrincipalId: 'federated/iam/ARIAGRGHRGGERHQWOJ:john.smith@example.com',
	UserName: 'quicksight-admin-role/john.smith@example.com',
	Role: 'ADMIN',
}

describe('QuickSightUser', () => {
	describe('succeeds when', () => {
		it('gets a valid user', () => {
			expect(new QuickSightUser(validUser)).toMatchInlineSnapshot(`
QuickSightUser {
  "arn": "arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-admin-role/john.smith@example.com",
  "email": "john.smith@example.com",
  "iamRole": "quicksight-admin-role",
  "invalid": false,
  "role": "ADMIN",
  "stsSession": "john.smith@example.com",
  "username": "quicksight-admin-role/john.smith@example.com",
}
`)
		})

		it('gets a user with an invalid username', () => {
			const user = new QuickSightUser({ ...validUser, UserName: 'N/A' })
			expect(user.invalid).toBe(true)
			expect(user).toMatchInlineSnapshot(`
QuickSightUser {
  "arn": "arn:aws:quicksight:us-east-1:1234567890:user/default/quicksight-admin-role/john.smith@example.com",
  "email": "john.smith@example.com",
  "iamRole": "N",
  "invalid": true,
  "role": "ADMIN",
  "stsSession": "A",
  "username": "N/A",
}
`)
		})

		it('gets a user with no stsSession (aka an IAM user)', () => {
			const user = new QuickSightUser({ ...validUser, Arn: 'arn:aws:quicksight:us-east-1:1234567890:user/default/sample-iam-user', UserName: 'sample-iam-user' })

			expect(user.stsSession).toBeUndefined()

			expect(user).toMatchInlineSnapshot(`
QuickSightUser {
  "arn": "arn:aws:quicksight:us-east-1:1234567890:user/default/sample-iam-user",
  "email": "john.smith@example.com",
  "iamRole": "sample-iam-user",
  "invalid": false,
  "role": "ADMIN",
  "stsSession": undefined,
  "username": "sample-iam-user",
}
`)
		})
	})
})