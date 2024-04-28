import { type NextFunction, type Request, type Response } from 'express';
import { deleteContactFormEntryService } from '../services/contactFormServices.js';
import { deleteFirebaseUserById } from '../services/FirebaseServices.js';

export const deleteContactFormEntryController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = parseInt(req.params.id);
		await deleteContactFormEntryService(id);
		res.redirect('/admin');
	} catch (error) {
		next(error);
	}
};

export const deleteUserBackOfficeController = async (req: Request, res: Response, next: NextFunction) => {

	try {
		await deleteFirebaseUserById(req.params.id);
		res.status(200).json({ message: 'User deleted' });
	} catch (error) {
		next(error);
	}
};