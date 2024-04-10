import { Router } from 'express';
import { deleteFirebaseUserById } from '../api/services/FirebaseServices.js';
import { updateFirebaseUserById } from '../api/services/FirebaseServices.js';
import { getFirebaseUsersByPage } from '../api/services/FirebaseServices.js';

const adminRouter = Router();

adminRouter.get('/users/delete/:id', async (_req, res) => {
	await deleteFirebaseUserById(_req.params.id);
	res.redirect('/admin');
});

adminRouter.post('/users/update/:id', async (_req, res) => {
	await updateFirebaseUserById(_req.params.id, {
		username: _req.body.username,
		mail: _req.body.mail,
		password: _req.body.password,
		role: _req.body.role
	});
	res.redirect('/admin');
});

adminRouter.get('/users-list/:page', async (_req, res) => {
	const users = await getFirebaseUsersByPage(parseInt(_req.params.page));
	res.render('./backoffice/dashboard.ejs', { users });
});

export default adminRouter;