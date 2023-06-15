import { User } from '@aws-sdk/client-quicksight'

export class QuickSightUser {
	arn: string // arn:aws:quicksight:<REGION>:<ACCOUNT>:user/default/<IAM ROLE NAME>/<STS SESSION>
	email: string
	lastAccess: Date // Comes from CloudTrail
	role: QuickSightRole
	username: string // <IAM ROLE>/<STS SESSION>
	iamRole: string
	stsSession: string
	invalid: boolean // User is invalid if username is "N/A". See README.md for more details

	constructor(quickSightUser: User) {
		this.arn = quickSightUser.Arn
		this.email = quickSightUser.Email
		this.role = QuickSightRole[quickSightUser.Role as keyof typeof QuickSightRole] // Only values that will be returned // also the keyof typeof hack came from here https://stackoverflow.com/a/42623905
		this.username = quickSightUser.UserName
		this.invalid = this.username === 'N/A'
		const [iamRole, stsSession] = this.username.split('/')
		this.iamRole = iamRole
		this.stsSession = stsSession
	}
}

export enum QuickSightRole {
	READER = 'READER', AUTHOR = 'AUTHOR', ADMIN = 'ADMIN'
}
