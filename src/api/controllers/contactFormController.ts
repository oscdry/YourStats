import { NextFunction, Request, Response } from 'express';
import Pino from '../../logger.js';
import prismaClient from '../db/dbConnections.js';

/**
 * Handles the contact form submission
 * @param req
 * @param res
 * @param next
 */
export const HandleContactForm = async (req: Request, res: Response, next: NextFunction) => {
	const { email, username, content } = req.body;

	Pino.info('Contact Form' + JSON.stringify(req.body));

	Pino.trace(JSON.stringify(req.body));

	try {
		await prismaClient.contactEntry.create({
			data: {

				// user_id can be null
				user_id: res.locals.user ? res.locals.user.id : null,
				username,
				email,
				content
			}
		});

		Pino.info('Contact form submitted');
		return res.json({ message: 'Contact form submitted' });
	} catch (error) {
		return next(error);
	}
};