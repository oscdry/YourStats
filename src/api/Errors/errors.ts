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

export class InvalidTokenError extends Error {
    constructor() {
        super('Invalid Token');
        this.name = 'InvalidTokenError';
    }
}

export class EmailUsed extends Error {
    constructor() {
        super('Error registering user.');
        this.name = 'This email is already provided'
    }
}

export class UsernameUsed extends Error {
    constructor() {
        super('Error registering user.');
        this.name = 'This username is already provided'
    }
}
