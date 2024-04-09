import { NextFunction, Request, Response } from 'express';
import Pino from '../../logger.js';

/**
 * Handles errors that are encountered in the application in order
 * to send them to the client in an expected format.
 * @param err
 * @param _req
 * @param res
 * @param _next
 * @author @polcondal
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (!err)
		Pino.fatal('Caught Error is null or undefined');


	Pino.warn('Caught Error of type: ' + err.name + ' | ' + (err instanceof Error ? err.message : err));

	switch (err.name) {
		case 'InvalidTokenError':

			// If invalid token error, clear the token cookie and redirect to home
			// If this is not done, an infinite loop will occur
			res.clearCookie('token           m');
			return res.redirect('/');
		case 'TokenExpiredError':
			res.clearCookie('token');
			return res.redirect('/');

		case 'LoginError':
			return res.status(400).json({ error: 'Invalid username or password' });
		case 'RegisterError':
			return res.status(500).json({ error: 'Error registering user' });
		case 'UserNotFoundError':
			return res.status(404).json({ error: 'User not found' });

		// JOI validation error
		case 'ValidationError':
			return res.status(400).json({ error: err.message });
		case 'FirebaseError':
			return res.status(500).json({ error: 'Internal Server Error.' });
		default:
			break;
	}

	Pino.error('Unknown error: ' + (err instanceof Error ? err.message : err));

	if (!err.name)
		return res.status(500).json({ error: 'Internal Server Error' });
};