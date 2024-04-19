import { type Request, type Response, NextFunction } from 'express';
import { generateTokenForUserId } from './tokenController.js';

import { createFirebaseUser, deleteFirebaseUserById, deleteFirebaseUserByMail, getFirebaseUserById, getFirebaseUserByMail, getFirebaseUserByUsername, updateFirebaseUserById, getAllFirebaseUsers, updateFirebaseUserName, updateFirebaseUserBio, userExistsByMail, userExists } from '../services/FirebaseServices.js';
import { EmailUsedError, RegisterError, UsernameUsedError, UpdateUserBioError, UpdateUsernameError } from '../errors/errors.js';
import { FirebaseUser } from '../types/FirebaseUser.js';
import Pino from '../../logger.js';
import sendEmail from '../utils/mailer.js';
import { NotFoundPage } from '../../routes/web.js';

export const renderUserView = async (_req: Request, res: Response) => {
	const user = await getFirebaseUserById(_req.params.id);
	if (!user) return NotFoundPage(_req, res);

	res.render('./user.ejs', { title: 'User', userView: user });
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
	const { username, mail, password } = req.body;

	Pino.info('UserController Creating User' + { username, mail, password });

	try {

		// Check if the user already exists
		const [user, userMail] = await userExists(username, mail);
		if (user)
			throw new UsernameUsedError();
		if (userMail)
			throw new EmailUsedError();

		const createUser = await createFirebaseUser(username, mail, password, '', 0);
		if (!createUser)
			throw new RegisterError();

		const token = generateTokenForUserId({
			id: createUser.id,
			mail: createUser.mail,
			username: createUser.username,
			role: createUser.role
		});
		return res.json({ token });
	} catch (error) {
		next(error);
	}
};
export async function deleteUser(req: Request, res: Response) {
	const { identifier } = req.params;

	Pino.info('UserController Deleting User', { identifier });

	try {
		if (identifier.includes('@')) {
			await deleteFirebaseUserByMail(identifier);
		} else {
			await deleteFirebaseUserById(identifier);
		}
	} catch (error) {
		const message = (error as Error).message;
		throw new Error('An error occurred while deleting the user' + message);
	}
}


export async function updateUser(req: Request, res: Response, next: NextFunction) {
	const { identifier } = req.params;

	Pino.info('UserController Updating User', { identifier });

	const updates = {
		username: req.body.username,
		mail: req.body.mail,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation,
		role: req.body.role,
		bio: req.body.bio
	};

	try {
		await updateFirebaseUserById(identifier, updates);
		res.json({ message: 'User updated successfully' });
	} catch (error) {
		error = new UpdateUsernameError();
		next(error);
	}
}

export const LogoutUser = (_req: Request, res: Response) => {
	res.clearCookie('token');
	res.sendStatus(200);
};

export const getAllUsers = async (_req: Request, res: Response) => {
	const users = await getAllFirebaseUsers();
	res.json(users);
};

export async function updateUserName(req: Request, res: Response, next: NextFunction) {
	const { identifier } = req.params;

	Pino.info('UserController Updating User', { identifier });

	const updates = {
		username: req.body.username
	};

	try {
		await updateFirebaseUserName(identifier, updates);

		const payload: TokenPayload = {
			id: res.locals.user.id,
			mail: res.locals.user.mail,
			username: updates.username,
			role: res.locals.user.role
		};

		const token = generateTokenForUserId(payload);

		return res.json({ token });

	} catch (error) {
		error = new UpdateUsernameError();
		next(error);
	}
}

export async function updateUserBioController(req: Request, res: Response, next: NextFunction) {
	const { identifier } = req.params;

	Pino.info('UserController Updating User', { identifier });

	const updates = {
		bio: req.body.bio
	};

	try {
		await updateFirebaseUserBio(identifier, updates);
		res.json({ message: 'User updated successfully' });
	} catch (error) {

		// error = new updateUserBioError();
		next(error);
	}
}

// User has to call this to generate a password reset token
export const requestPasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
	const { mail } = res.locals.user;

	try {
		const user = await userExistsByMail(mail);

		if (!user) {
			Pino.trace('User not found for password reset');
			return res.json({ message: 'Email sent' });
		}

		Pino.debug('Sending email for password reset to user:' + user.mail);

		const backendUrl = req.protocol + '://' + req.get('host');

		await sendEmail(mail,
			'Password reset',
			`${backendUrl}/password-reset/${user.id}`);

		res.json({ message: 'Email sent' });
	} catch (error) {
		next(error);
	}
};

// User has to call this to reset the password after receiving the email
export const resetPasswordController = (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.params;



};

// Main function to get user by identifier from Firebase Services
export async function getUserByIdentifier(identifier: string,
	type: 'email' | 'username' | 'id' = 'id'): Promise<FirebaseUser | null> {

	if (!identifier) {
		Pino.error('No identifier provided getting user by identifier');
		return null;
	}

	Pino.info('Getting user with identifier: ' + identifier + ', type:' + type);

	let user = null;

	switch (type) {
		case 'email':
			user = await getFirebaseUserByMail(identifier);
			break;
		case 'username':
			user = await getFirebaseUserByUsername(identifier);
			break;
		case 'id':
			user = await getFirebaseUserById(identifier);
			break;
		default:
			throw new Error('Invalid get user type:', type);
	}

	if (!user) {
		Pino.error('User not found getting user by identifier:' + identifier + ' + type:' + type);
		return null;
	}

	Pino.debug('User found getting user by identifier:' + identifier + ' + type:' + type + ' user:' + user);

	return user;
}


export const uploadUserImageController = async (req: Request, res: Response) => {
	Pino.trace('hola');
	if (req.file) {
		Pino.debug('File uploaded:' + req.file);
		res.sendStatus(200);
	} else {
		res.status(400).json({ message: 'Error uploading image' });
	}
};

