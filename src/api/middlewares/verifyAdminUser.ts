import { type Response, type Request, NextFunction } from 'express';
import { MissingPrivilegesError } from '../errors/errors.js';
import Pino from '../../logger.js';

/**
 * Verify if the user is an admin, we assume they have a valid token
 */
export const verifyAdminUser = async (_req: Request, res: Response, next: NextFunction) => {
	try {

		// Check if the user is an admin
		if (parseInt(res.locals.user.role) !== 1) {
			Pino.trace('User ' + JSON.stringify(res.locals.user) + ' is not an admin');
			throw new MissingPrivilegesError();
		}
		next();
	} catch (error) {
		next(error);
	}
};
