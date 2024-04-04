import { Request, Response, Router } from 'express';
import { createUser, getUserByIdentifier, deleteUser, updateUser, LogoutUser, getAllUsers, updateUserName } from '../api/controllers/userController.js';
import { validateCreateUser } from '../api/middlewares/validateCreateUsers.js';
import { validateUpdateUser } from '../api/middlewares/validateUpdateUser.js';
import { validateNameUserUpdate } from '../api/middlewares/validateNameUserUpdate.js';
import { LoginUser } from '../api/controllers/loginController.js';
import { validateUserIdentifier } from '../api/middlewares/validateUserIdentifier.js';
import { errorHandler } from '../api/middlewares/errorHandler.js';
import { GetLolUserData } from '../api/services/lolServices.js';
import { updateFirebaseUserById, updateFirebaseUserName } from '../api/services/FirebaseServices.js';
import { verifyTokenOptional } from '../api/middlewares/verifyToken.js';
import Pino from '../logger.js';
import { RiotDataByName } from '../api/services/riotServices.js';
import { riotUserExists, sendLolData } from '../api/controllers/lolController.js';


const apiRouter = Router();

// Auth
apiRouter.post('/login', LoginUser);
apiRouter.post('/logout', LogoutUser);
apiRouter.post('/register', validateCreateUser, createUser);

// Users
apiRouter.delete('/delete-user/:identifier', validateUserIdentifier, deleteUser);
apiRouter.put('/update-user/:identifier', validateUserIdentifier, validateUpdateUser, updateUser);
apiRouter.get('/get-user/:identifier', validateUserIdentifier, async (req, res, next) => {
	const user = await getUserByIdentifier(req.params.identifier, 'username');
	Pino.trace(JSON.stringify(user));
	return res.json(user);
});

apiRouter.get('/users/search/:identifier', validateUserIdentifier, (req) => {
	const user = getUserByIdentifier(req.params.identifier, 'email');
	return user;
});
apiRouter.use(verifyTokenOptional);

apiRouter.put('/update-user-username/:identifier', validateUserIdentifier, validateNameUserUpdate, updateUserName);

apiRouter.get('/get-all-users', getAllUsers);

// League of Legends API
apiRouter.post('/riot-user/', riotUserExists);

apiRouter.get('/lol-data/:username', sendLolData);

export default apiRouter;