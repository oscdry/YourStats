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