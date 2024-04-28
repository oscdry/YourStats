import { NextFunction, Request, Response } from 'express';
import { getFirebaseUsersByPage } from '../services/FirebaseServices.js';
import { getContactFormEntriesService } from '../services/contactFormServices.js';

export const RenderBackoffice = async (req: Request, res: Response, _next: NextFunction) => {

	// Obtener el número de página de los parámetros de consulta, por defecto es 1
	const page = parseInt(req.query.page as string) || 1;
	const { users, count } = await getFirebaseUsersByPage(page); // Desestructura el resultado para obtener el conteo de usuarios

	const contactEntries = await getContactFormEntriesService();
	res.render('./backoffice/dashboard.ejs', { title: 'Admin Panel', users, page, count, contactEntries }); // Incluye el conteo en los datos renderizados
};