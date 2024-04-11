import { type Response, type Request, NextFunction } from 'express';
import { MissingPrivilegesError } from '../errors/errors.js';

/**
 * Verify if the user is an admin, we assume they have a valid token
 */
export const verifyAdminUser = async (_req: Request, res: Response, next: NextFunction) => {
	try {

		// Check if the user is an admin
		if (res.locals.user.role !== 1) {
			throw new MissingPrivilegesError();
		}
		next();
	} catch (error) {
		next(error);
	}
};
