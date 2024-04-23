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

export class MissingPrivilegesError extends Error {
	constructor() {
		super('Missing Privileges');
		this.name = 'MissingPrivilegesError';
	}
}

export class EmailUsedError extends Error {
	constructor() {
		super('This email is already provided');
		this.name = 'EmailUsedError';
	}
}

export class UsernameUsedError extends Error {
	constructor() {
		super('Username already in use');
		this.name = 'UsernameUsedError';
	}
}

export class UpdateUsernameError extends Error {
	constructor() {
		super('Error updating username');
		this.name = 'UpdateUsernameError';
	}
}

export class UpdateUserBioError extends Error {
	constructor() {
		super('Error updating Bio for user');
		this.name = 'UpdateBioError';    
	}
}

export class ImageFormatError extends Error {
	constructor() {
		super('Wrong image format');
		this.name = 'ImageFormatError';
	}
}