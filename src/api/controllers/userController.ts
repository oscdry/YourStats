import { type Request, type Response, NextFunction } from 'express';
import firestore from '../db/firebaseConnections.js';
import { generateTokenForUserId } from './tokenController.js';

import { createFirebaseUser, deleteFirebaseUserById, deleteFirebaseUserByMail, getFirebaseUserById, getFirebaseUserByMail, getFirebaseUserByUsername, updateFirebaseUserById, getAllFirebaseUsers, updateFirebaseUserName, updateFirebaseUserBio } from '../services/FirebaseServices.js';
import { EmailUsedError, RegisterError, UsernameUsedError, UpdateUserBioError, UpdateUsernameError } from '../errors/errors.js';
import { UserNotFoundError } from '../errors/errors.js';
import Pino from '../../logger.js';

export async function createUser(req: Request, res: Response, next: NextFunction) {
	const { username, mail, password } = req.body;

	Pino.info('UserController Creating User', { username, mail, password });

	try {
		const user = await getUserByIdentifier(username, 'username');
		if (user)
			throw new UsernameUsedError();

		const userMail = await getUserByIdentifier(mail, 'email');
		if (userMail)
			throw new EmailUsedError();

		const createUser = await createFirebaseUser(username, mail, password, '', 0);
		if (!createUser)
			throw new UserNotFoundError();

		const token = generateTokenForUserId({ id: createUser.id, username: createUser.username, role: createUser.role });
		return res.json({ token });
	} catch (error) {
		next(new RegisterError());
	}
}

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

export async function updateUserBio(req: Request, res: Response, next: NextFunction) {
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


// user Image controller
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configura multer para almacenar archivos en el directorio deseado
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = '/img/storage/users';

		// Crea el directorio si no existe
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir);
	},
	filename: function (req, file, cb) {

		// Obtiene el userId desde el cuerpo de la petición o cualquier otra lógica que utilices
		const userId = req.body.userId;

		// Construye el nombre del archivo con el userId y la extensión original
		const fileName = userId + path.extname(file.originalname);
		cb(null, fileName);
	}
});

// Filtra los archivos para asegurar que solo se suban imágenes
const fileFilter = (req: Request, file: any, cb: any) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Not an image! Please upload only images.'), false);
	}
};
export const upload = multer({ storage: storage, fileFilter: fileFilter });


