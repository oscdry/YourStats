import { Request, Response, Router } from 'express';
import { createUser, getUserByIdentifier, deleteUser, updateUser, LogoutUser, getAllUsers, updateUserName, updateUserBio } from '../api/controllers/userController.js';
import { validateUpdateUser } from '../api/middlewares/validateUpdateUser.js';
import { validateNameUserUpdate } from '../api/middlewares/validateNameUserUpdate.js';
import { LoginGoogleUser, LoginUser } from '../api/controllers/loginController.js';

import { verifyTokenOptional, verifyTokenRequired } from '../api/middlewares/verifyToken.js';
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
apiRouter.use(verifyTokenOptional);

// Contact form
apiRouter.post('/contact-form', joiValidate(contactFormSchema), HandleContactForm);

// Auth
apiRouter.post('/login', LoginUser);
apiRouter.post('/login-google', LoginGoogleUser);
apiRouter.post('/register', joiValidate(createUserSchema), createUser);

// League of Legends API
apiRouter.post('/riot-user/', RiotUserExists);
apiRouter.get('/lol/skins/:skinName', sendLolSkin);
apiRouter.get('/lol-data/:username', SendLolData);

// Brawl Stars API
apiRouter.post('/brawl-user/', BrawlUserExists);
apiRouter.get('/brawl-data/:tag', SendBrawlData);

// Rutas privadas --------------------------------------------
apiRouter.use(verifyTokenRequired);

apiRouter.post('/logout', LogoutUser);

// Users
apiRouter.get('/users/search/:identifier', joiValidate(getUserSchema), (req) => {
	const user = getUserByIdentifier(req.params.identifier, 'email');
	return user;
});

apiRouter.get('/get-all-users', getAllUsers);
apiRouter.delete('/delete-user/:identifier', joiValidate(getUserSchema), deleteUser);
apiRouter.put('/update-user/:identifier', joiValidate(getUserSchema), validateUpdateUser, updateUser);
apiRouter.put('/update-user-bio/:identifier', updateUserBio);

apiRouter.get('/get-user/:identifier', joiValidate(getUserSchema), async (req, res, next) => {
	const user = await getUserByIdentifier(req.params.identifier, 'username');
	Pino.trace(JSON.stringify(user));
	return res.json(user);
});
apiRouter.put('/update-user-username/:identifier', joiValidate(getUserSchema), validateNameUserUpdate, updateUserName);

apiRouter.post('/search-by-email', async (req, res) => {
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

// ruta update image
apiRouter.post('/upload/:userId', upload.single('image'), (req: Request, res: Response) => {
	Pino.trace('hola');
	if (req.file) {
		Pino.debug('File uploaded:' + req.file);
		res.sendStatus(200);
	} else {
		res.status(400).json({ message: 'Error uploading image' });
	}
});

export default apiRouter;