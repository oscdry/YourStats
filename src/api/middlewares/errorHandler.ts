import { NextFunction, Request, Response } from 'express';
import Pino from '../../logger.js';
import { RenderErrorPage } from '../../routes/web.js';

/**
 * @param req
 * @param res
 */
const handleApiError = (req: Request, res: Response, errorString: string, code: number): void => {
	res.status(code).json({ error: errorString });
};

/**
 * Handles errors that are encountered in the application in order
 * to send them to the client in an expected format.
 * @param err
 * @param req
 * @param res
 * @param _next
 * @author @polcondal
 */
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
	if (!err)
		Pino.fatal('Caught Error is null or undefined');


	Pino.error('Caught Error of type: ' + err.name + ' | ' + (err instanceof Error ? err.message : err));

	switch (err.name) {

		// Token Errrors ---
		// If invalid token error, clear the token cookie and redirect to home
		// If this is not done, an infinite loop will occur
		case 'InvalidTokenError':
			res.clearCookie('token');
			return handleApiError(req, res, 'Not Authorized', 401);

		// If token required error, redirect to home
		case 'TokenRequiredError':
			res.clearCookie('token');
			return handleApiError(req, res, 'Not Authorized', 401);

		// If token expired, clear the token cookie and redirect to home
		case 'TokenExpiredError':
			res.clearCookie('token');
			return handleApiError(req, res, 'Not Authorized', 401);
		case 'MissingPrivilegesError':
			return handleApiError(req, res, 'Not Authorized', 403);

		// Auth/User Errors
		case 'LoginError':
			return res.status(400).json({ error: 'Invalid username or password' });
		case 'RegisterError':
			return res.status(500).json({ error: 'Error registering user' });
		case 'EmailUsedError':
			return res.status(400).json({ error: 'Email already in use' });
		case 'UsernameUsedError':
			return res.status(400).json({ error: 'Username already in use' });
		case 'UserNotFoundError':
			return res.status(404).json({ error: 'User not found' });

		// JOI validation error
		case 'ValidationError':
			return res.status(400).json({ error: err.message });

		case 'ImageFormatError':
			return res.status(400).json({ error: 'Invalid image format.' });

		// External service errors
		case 'ExternalServiceError':
			return res.status(500).json({ error: 'There was an error connecting with external services, this should be fixed soon, apologies!' });

		// Internal errors
		case 'FirebaseError':
			return res.status(500).json({ error: 'Internal server error.' });
		case 'SyntaxError':
			return RenderErrorPage(res);
		case 'ReferenceError':
			return RenderErrorPage(res);
		case 'TypeError':
			return RenderErrorPage(res);
		default:
			break;
	}

	Pino.error('Unknown error: ' + (err instanceof Error ? err.message : err));
	return res.status(500).json({ error: 'Internal server error' });
};