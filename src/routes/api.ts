import { Request, Response, Router } from 'express';
import { createUserController, getUserByIdentifier, deleteUser, updateUser, LogoutUser, getAllUsers, updateUserName, updateUserBioController, requestPasswordResetController, uploadUserImageController } from '../api/controllers/userController.js';
import { validateUpdateUser } from '../api/middlewares/validateUpdateUser.js';
import { validateNameUserUpdate } from '../api/middlewares/validateNameUserUpdate.js';
import { LoginGoogleUser, LoginUser } from '../api/controllers/loginController.js';

import { verifyTokenRequired } from '../api/middlewares/verifyToken.js';
import Pino from '../logger.js';
import { RiotUserExists, SendLolData, sendLolSkin } from '../api/controllers/lolController.js';
import { HandleContactForm } from '../api/controllers/contactFormController.js';
import { joiValidate } from '../api/middlewares/joiValidate.js';
import { contactFormSchema, createUserSchema, getUserSchema } from '../api/middlewares/schemas.js';
import { BrawlUserExists, SendBrawlData } from '../api/controllers/brawlController.js';
import { upload } from '../api/middlewares/multer.js';
import { searchByEmailBackoffice } from '../api/services/FirebaseServices.js';


const apiRouter = Router();

// Rutas públicas --------------------------------------------

// Contact form
apiRouter.post('/contact-form',
	joiValidate(contactFormSchema, 'body'),
	HandleContactForm);

// Auth
apiRouter.post('/login', LoginUser);
apiRouter.post('/login-google', LoginGoogleUser);
apiRouter.post('/register',
	joiValidate(createUserSchema, 'body'),
	createUserController);

// League of Legends API
apiRouter.post('/riot-user/', RiotUserExists);
apiRouter.get('/lol/skins/:skinName', sendLolSkin);
apiRouter.get('/lol-data/:username', SendLolData);

// Brawl Stars API
apiRouter.post('/brawl-user/', BrawlUserExists);
apiRouter.get('/brawl-data/:tag', SendBrawlData);

// Rutas privadas --------------------------------------------
apiRouter.post('/logout',
	verifyTokenRequired,
	LogoutUser);

apiRouter.get('/password-reset',
	verifyTokenRequired,
	requestPasswordResetController);

// Users
apiRouter.get('/users/search/:identifier',
	verifyTokenRequired,
	joiValidate(getUserSchema, 'params'),
	(req) => {
		const user = getUserByIdentifier(req.params.identifier, 'email');
		return user;
	});

/**
 * @deprecated
 */
// privateApiRouter.get('/get-all-users', getAllUsers);

apiRouter.delete('/delete-user/:identifier',
	verifyTokenRequired,
	joiValidate(getUserSchema, 'params'),
	deleteUser);

apiRouter.put('/update-user/:identifier',
	verifyTokenRequired,
	joiValidate(getUserSchema, 'params'),
	validateUpdateUser,
	updateUser);

apiRouter.put('/update-user-bio/:identifier',
	verifyTokenRequired,
	joiValidate(getUserSchema, 'params'),
	updateUserBioController);

apiRouter.get('/get-user/:identifier',
	verifyTokenRequired,
	joiValidate(getUserSchema, 'params'),
	async (req, res, next) => {
		const user = await getUserByIdentifier(req.params.identifier, 'username');
		Pino.trace(JSON.stringify(user));
		return res.json(user);
	});

apiRouter.put('/update-user-username/:identifier',
	verifyTokenRequired,
	joiValidate(getUserSchema, 'params'),
	validateNameUserUpdate,
	updateUserName);

apiRouter.post('/search-by-email',
	verifyTokenRequired,
	async (req, res) => {
		try {
			const { email } = req.body; // Suponiendo que el campo del correo se llama "email" en el body
			if (!email) {
				return res.status(400).json({ error: 'El campo de correo electrónico es obligatorio' });
			}

			const users = await searchByEmailBackoffice(email);
			return res.json(users);
		} catch (error) {
			console.error('Error al buscar usuarios por correo electrónico:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	});

// Ruta update image
apiRouter.post('/upload/:userId',
	verifyTokenRequired,
	upload.single('image'),
	uploadUserImageController);

export { apiRouter };