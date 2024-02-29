export class LoginError extends Error {
    constructor() {
        super('Invalid password or username.');
        this.name = 'LoginError';
    }
}