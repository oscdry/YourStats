import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getUserByIdentifier, userExists, userExistsByMail } from './userController.js';
import { generateTokenForUserId as generateTokenForUser } from './tokenController.js';
import { LoginError } from '../errors/errors.js';
import Pino from '../../logger.js';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { createFirebaseUser } from '../services/FirebaseServices.js';

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;
	if (!username || !password) {
		Pino.debug('Empty username or password in login');
		throw new LoginError();
	}

	Pino.info('Login User' + JSON.stringify(req.body));

	try {

		const user = await getUserByIdentifier(username, 'username');
		if (!user) {
			Pino.debug('User with username: ' + username + ' not found in login');
			throw new LoginError();
		}

		const validPassword = await bcrypt.compare(password, user.hash);
		if (!validPassword) {
			Pino.debug('User with username: ' + username + '  invalid password');
			throw new LoginError();
		}

		const payload: TokenPayload = {
			id: user.id,
			username: user.username,
			role: user.role
		};

		const token = generateTokenForUser(payload);

		Pino.info('User ' + username + ' logged in');
		return res.json({ token });
	} catch (error) {
		return next(error);
	}
};

export const LoginGoogleUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { credential } = req.body;
		if (!credential) {
			Pino.debug('Empty id_token in google login');
			throw new LoginError();
		}

		const googleCredential = GoogleAuthProvider.credential(credential);

		// Sign in with credential from the Google user.
		const auth = getAuth();
		const result = await signInWithCredential(auth, googleCredential);

		// Check if the user exists
		const existingUser = await userExistsByMail(
			result.user.email ? result.user.email : '');

		let userId: string| undefined = undefined;

		// Create the user
		if (!existingUser) {
			const user = await createFirebaseUser(
				result.user.displayName ? result.user.displayName : 'Unnamed User',
				result.user.email ? result.user.email : '',
				'',
				'',
				0,
				true // Google user
			);

			userId = user?.id;

			if (!user) {
				Pino.error('Error creating user in google login');
				throw new LoginError();
			}

			Pino.debug('User ' + user.username + ' created in google login');
		}


		const payload: TokenPayload = {
			id: userId ? userId : existingUser!.id,
			username: result.user.displayName ? result.user.displayName : 'Unnamed User',
			role: 0
		};

		const token = generateTokenForUser(payload);
		return res.json({ token });
	} catch (error) {
		if (error instanceof Error) {
			Pino.error('Error in google login: ' + error.message + error.stack);
			return next(error);
		}

		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;

		// The email of the user's account used.
		const email = error.customData.email;

		// The AuthCredential type that was used.
		const credential = GoogleAuthProvider.credentialFromError(error);
		next(error);
	}

};