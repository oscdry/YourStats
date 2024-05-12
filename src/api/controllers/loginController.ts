import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getUserByIdentifier } from './userController.js';
import { generateTokenForUserId as generateTokenForUser, setTokenToCookie } from './tokenController.js';
import { LoginError } from '../errors/errors.js';
import Pino from '../../logger.js';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { createFirebaseUser, userExistsByMail } from '../services/FirebaseServices.js';

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
			mail: user.mail,
			role: user.role
		};

		const token = generateTokenForUser(payload);
		setTokenToCookie(res, token);
		Pino.info('User ' + username + ' logged in');
		return res.json({ token });
	} catch (error) {
		next(error);
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

		let userId: string | undefined = undefined;

		// Create the user
		if (!existingUser) {
			Pino.trace('User ' + result.user.displayName + ' not found for login, creating user');
			const trimmedName = result.user.displayName ? result.user.displayName.substring(0, 16) : 'Unnamed User';
			const user = await createFirebaseUser(
				trimmedName,
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
			mail: result.user.email ? result.user.email : '',
			username: existingUser ? existingUser.username : result.user.displayName ? result.user.displayName : 'Unnamed User',
			role: existingUser ? existingUser.role : 0
		};

		const token = generateTokenForUser(payload);
		const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
		res.cookie('token', token, { expires, httpOnly: true });
		return res.json({ token });
	} catch (error) {
		if (error instanceof Error) {
			Pino.error('Error in google login: ' + error.message + error.stack);
			return next(error);
		}

		const googleError = error as any;

		const errorCode = googleError.code;
		const errorMessage = googleError.message;

		// The email of the user's account used.
		const email = googleError.customData.email;

		// The AuthCredential type that was used.
		const credential = GoogleAuthProvider.credentialFromError(googleError);
		next(error);
	}

};