import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '../errors/errors.js';
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
			console.log('No optional token provided');
			return next();
		}

		res.locals.user = verifyToken(cookieToken) as TokenPayload;

		if (!res.locals.user) {
			console.log('No optional token provided');
			return next();
		}

		console.log('Token verified for user:', JSON.stringify(res.locals.user));
		next();

	} catch (error) {
		Pino.debug('Error verifying token:', error);

		// On error catch, check if the error is a token expired error
		// It redirects the user and clears token
		if (error instanceof jwt.TokenExpiredError) {
			next(new InvalidTokenError());
		}
	}
};

/**
 * Validates the login token (Required).
 * Returns the user to the home page if the token is not provided.
 * @param req
 * @param res
 * @param next
 */
export const verifyTokenRequired = (req: Request, res: Response, next: NextFunction) => {
	try {
		const cookieToken = req.cookies.token || null;

		if (!cookieToken) {
			console.log('No required token provided');
			throw new InvalidTokenError();
		}

		res.locals.user = verifyToken(cookieToken) as TokenPayload;
	} catch (error) {
		console.error('Error verifying token:', error);
		next(error);
	}
};

const verifyToken = (token: string) => {
	return jwt.verify(token, JWT_SECRET!);
};