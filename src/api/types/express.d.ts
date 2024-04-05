declare global {
	namespace Express {
		interface Locals {
			token: TokenPayload;
		}
	}
}