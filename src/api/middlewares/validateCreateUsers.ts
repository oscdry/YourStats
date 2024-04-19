import { type Request, type Response, type NextFunction } from 'express';
import { createUserSchema, passwordRegex } from './schemas.js';
import { getFirebaseUserByUsername } from '../services/FirebaseServices.js';
import { EmailUsedError } from '../errors/errors.js';

// Validate the method for create users
export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {

	if (!passwordRegex.test(req.body.password)) {
		throw new Error('Password must have at least 8 characters, including one uppercase letter, one lowercase letter, and one number');
	}

	// Check if the mail is already in use
	const { mail } = req.body;
	const userExists = await getFirebaseUserByUsername(mail);
	if (userExists)
		throw new EmailUsedError();

	// Execute check
	const { error } = createUserSchema.validate(req.body);
	if (error)
		return res.status(400).json({ error: error.details[0].message });

	next();
};