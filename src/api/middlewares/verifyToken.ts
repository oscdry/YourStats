import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidTokenError as TokenRequiredError } from '../errors/errors.js';
import Pino from '../../logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('Error, No JWT_SECRET set');
}

/**
 * Validates the login token (Optional).
 * @param req
 * @param res
 * @param next
 * @returns
 * @author @polcondal
 */
export const verifyTokenOptional = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const cookieToken = req.cookies.token || null;

		if (!cookieToken) {
			Pino.trace('No optional token provided in web');
			next();
			return;
		}

		// Save the payload in the res.locals
		res.locals.user = verifyToken(cookieToken) as TokenPayload;

		if (!res.locals.user) {
			Pino.trace('No valid optional token provided');
			next();
			return;
		}

		Pino.trace('Valid optional Token verified for user:' + JSON.stringify(res.locals.user));
		next();
	} catch (error) {
		if (error instanceof Error && error.name === 'TokenExpiredError') {
			Pino.warn('Optional token expired, clearing it...');
			res.clearCookie('token');
			next();
			return;
		}

		Pino.error('Error verifying Optional token:' + error);
		next(error);
	}
};

/**
 * Validates the login token (Required).
 * @param req
 * @param res
 * @param next
 */
export const verifyTokenRequired = (req: Request, res: Response, next: NextFunction) => {
	const cookieToken = req.cookies.token || null;
	const hasToken = cookieToken !== null;
	try {
		if (!cookieToken) {
			Pino.warn('No required token provided');
			throw new TokenRequiredError();
		}

		const valid = verifyToken(cookieToken) as TokenPayload;
		if (!valid) {
			Pino.warn('Invalid token provided');
			throw new TokenRequiredError();
		}

		Pino.trace('Required valid token provided');
		next();
	} catch (error) {
		Pino.warn('Error verifying Required token:' + error + ' | empty token value? ' + !hasToken);

		// On error catch, check if the error is a token expired error
		// It redirects the user and clears token
		if (error instanceof jwt.TokenExpiredError) {
			next(error);
		}

		if (error instanceof TokenRequiredError) {
			Pino.warn('Bad token on required token route');
			next(error);
		}
	}
};

const verifyToken = (token: string) => {
	return jwt.verify(token, JWT_SECRET!);
};