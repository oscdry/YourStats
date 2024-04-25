import { Router } from 'express';
import { deleteFirebaseUserById } from '../api/services/FirebaseServices.js';
import { updateFirebaseUserById } from '../api/services/FirebaseServices.js';
import { getFirebaseUsersByPage } from '../api/services/FirebaseServices.js';
import { verifyAdminUser } from '../api/middlewares/verifyAdminUser.js';
import { RenderBackoffice } from '../api/controllers/backofficeController.js';

const adminRouter = Router();

adminRouter.use(verifyAdminUser);

// Páginas de administrador
adminRouter.get('/', RenderBackoffice);

adminRouter.get('/users/delete/:id', async (req, res) => {
	await deleteFirebaseUserById(req.params.id);
	res.redirect('/admin');
});

adminRouter.post('/users/update/:id', async (req, res) => {
	await updateFirebaseUserById(req.params.id, {
		username: req.body.username,
		mail: req.body.mail,
		password: req.body.password,
		role: req.body.role
	});
	res.redirect('/admin');
});

adminRouter.get('/users-list/:page', async (req, res) => {
	const users = await getFirebaseUsersByPage(parseInt(req.params.page));
	res.render('./backoffice/dashboard.ejs', { users });
});

export default adminRouter;