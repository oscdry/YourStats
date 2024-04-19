export interface FirebaseUser {
	id: string,
	username: string,
	mail: string,
	bio: string,
	hash: string,
	role: number,
	resetPasswordToken: string,
	resetPasswordExpires: number,
}