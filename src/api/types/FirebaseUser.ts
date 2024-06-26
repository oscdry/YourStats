export interface FirebaseUser {
	id: string,
	username: string,
	mail: string,
	bio: string,
	hash: string,
	role: number,
	google: number,
	resetPasswordToken: string,
	resetPasswordExpires: number,
}