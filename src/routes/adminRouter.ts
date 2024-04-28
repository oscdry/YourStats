import { type NextFunction, type Request, type Response, Router } from 'express';
import { deleteFirebaseUserById } from '../api/services/FirebaseServices.js';
import { updateFirebaseUserById } from '../api/services/FirebaseServices.js';
import { getFirebaseUsersByPage } from '../api/services/FirebaseServices.js';
import { verifyAdminUser } from '../api/middlewares/verifyAdminUser.js';
import { RenderBackoffice } from '../api/controllers/backofficeController.js';
import { next } from 'cheerio/lib/api/traversing.js';
import { deleteContactFormEntryService } from '../api/services/contactFormServices.js';
import { deleteContactFormEntryController, deleteUserBackOfficeController } from '../api/controllers/adminController.js';

const adminRouter = Router();

adminRouter.use(verifyAdminUser);

// Páginas de administrador
adminRouter.get('/', RenderBackoffice);

adminRouter.delete('/users/delete/:id', deleteUserBackOfficeController);

adminRouter.post('/users/update/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await updateFirebaseUserById(req.params.id, {
			username: req.body.username,
			mail: req.body.mail,
			password: req.body.password,
			role: req.body.role
		});
		res.redirect('/admin');
	} catch (error) {
		next(error);
	}
});

adminRouter.get('/users-list/:page', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await getFirebaseUsersByPage(parseInt(req.params.page));
		res.render('./backoffice/dashboard.ejs', { users });
	} catch (error) {
		next(error);
	}
});

adminRouter.get('/contact/delete/:id', deleteContactFormEntryController);

export default adminRouter;