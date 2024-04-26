import { type Request, type Response, NextFunction } from 'express';
import { getFirebaseUserByResetPasswordToken, updateFirebaseUserById, updateUserPassword } from '../services/FirebaseServices.js';
import { NotFoundPage } from '../../routes/web.js';
import Pino from '../../logger.js';
import { randomBytes } from 'crypto';
import { getUserByIdentifier, getUserIdentifierType } from './userController.js';
import { UserNotFoundError } from '../errors/errors.js';
import sendEmail from '../utils/mailer.js';


// The first step to reset the password is to render the password reset form
export async function renderPasswordResetView(req: Request, res: Response, next: NextFunction) {
	const { token } = req.params;

	if (!token)
		return res.render('./password-reset-form.ejs', { title: 'Password Reset', user: res.locals.user });

	try {
		const user = await getFirebaseUserByResetPasswordToken(token);
		if (!user) {
			Pino.warn('User not found for password reset');
			return NotFoundPage(res);
		}

		res.render('./password-reset-enter.ejs', { title: 'Password Reset', user });
	} catch (error) {
		Pino.error('Error rendering password reset view:', error);
		next(error);
	}
}

// User calls this to generate a password reset token using the form above
// Generates a token and sends an email to the user with a link to reset the password using the token
// Saves the token and its expiration time in the database for later verification
// It then renders a view to inform the user.
export const requestPasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
	const { identifier } = req.body;

	try {
		const user = await getUserByIdentifier(identifier, getUserIdentifierType(identifier));

		if (!user) {
			Pino.trace('User not found for password reset');
			return res.sendStatus(200);
		}

		Pino.debug('Sending email for password reset to user:' + user.mail);

		// Generate a token and set its expiration time to 1 hour from now
		const resetToken = randomBytes(20).toString('hex');
		const resetTokenExpiration = Date.now() + 3600000; // 1 hour

		// Save the token and its expiration time in the database
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = resetTokenExpiration;
		await updateFirebaseUserById(user.id, user);
		const backendUrl = req.protocol + '://' + req.get('host');

		Pino.trace('Token saved for password reset');

		await sendEmail(user.mail,
			'Password reset',
			`${backendUrl}/password-reset/${user.resetPasswordToken}`);

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};

// Simply renders the sent page
export async function renderPasswordResetViewSent(_req: Request, res: Response) {
	res.render('./password-reset-sent.ejs', { title: 'Password Reset', user: res.locals.user });
}

// User has to visit here to reset the password after entering email link
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.params;
	if (!token)
		return NotFoundPage(res);

	try {
		const user = await getFirebaseUserByResetPasswordToken(token);

		if (!user) {
			Pino.warn('User not found for password reset');
			return NotFoundPage(res);
		}

		if (user.resetPasswordExpires < Date.now()) {
			Pino.warn('Password reset token expired');
			return NotFoundPage(res);
		}

		Pino.trace('Password reset token valid, rendering password reset enter view');
		res.render('./password-reset-enter.ejs', { title: 'Password Reset', user });
	} catch (error) {
		Pino.error('Error rendering password reset enter view:', error);
		next(error);
	}
};

export const resetPasswordSubmitController = async (req: Request, res: Response, next: NextFunction) => {
	const { password, token } = req.body;

	try {
		const user = await getFirebaseUserByResetPasswordToken(token);

		if (!user) {
			Pino.warn('User not found for password reset');
			throw new UserNotFoundError();
		}

		if (user.resetPasswordExpires < Date.now()) {
			Pino.warn('Password reset token expired');
			throw new Error('Password reset token expired');
		}

		const result = await updateUserPassword(user, password);
		if (!result)
			throw new Error('Error updating user password');

		Pino.trace('Password reset successful for ' + user.mail);
		return res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};

export const renderPasswordResetSuccess = (_req: Request, res: Response) => {
	res.render('partials/bigpage-generic.ejs', {
		title: 'Password Reset',
		headerText: 'Contraseña cambiada', headerId: 'password-reset-success',
		paragraphText: 'Tu contraseña ha sido cambiada con éxito. Ya puedes iniciar sesión con tu nueva contraseña!',
		paragraphId: 'password-reset-success-paragraph',
		user: res.locals.user
	});
};