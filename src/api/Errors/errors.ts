export class LoginError extends Error {
	constructor() {
		super('Invalid password or username.');
		this.name = 'LoginError';
	}
}

export class RegisterError extends Error {
	constructor() {
		super('Error registering user.');
		this.name = 'RegisterError';
	}
}

export class UserNotFoundError extends Error {
	constructor() {
		super('User Not Found.');
		this.name = 'UserNotFoundError';
	}
}

export class ExternalServiceError extends Error {
	constructor() {
		super('Error with external service. Check that any keys are valid.');
		this.name = 'ExternalServiceError';
	}
}

export class InvalidTokenError extends Error {
	constructor() {
		super('Invalid Token');
		this.name = 'InvalidTokenError';
	}
}

export class EmailUsedError extends Error {
	constructor() {
		super('This email is already provided');
		this.name = 'Email used';
	}
}

export class UsernameUsedError extends Error {
	constructor() {
		super('This username is already provided');
		this.name = 'Username used';
	}
}

export class UpdateUsernameError extends Error {
	constructor() {
		super('Error updating username');
		this.name = 'Update username';
	}
}

export class UpdateUserBioError extends Error {
	constructor() {
		super('Error updating Bio for user');
		this.name = 'Update Bio';
	}
}