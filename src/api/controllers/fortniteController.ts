import { NextFunction, Request, Response } from 'express';
import { GetFortniteData } from '../services/forniteServices.js';

export const SendFortniteData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userTag = req.params.tag;
		return res.json(await GetFortniteData(userTag));
	} catch (error) {
		next(error);
	}
};