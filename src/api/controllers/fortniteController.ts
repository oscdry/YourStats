import { NextFunction, Request, Response } from 'express';
import { GetFortniteData, getFortniteShopData, loadShop } from '../services/forniteServices.js';

export const SendFortniteData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userTag = req.params.tag;
		return res.json(await GetFortniteData(userTag));
	} catch (error) {
		next(error);
	}
};

export const SendFortniteHomeData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		return res.json(await loadShop());
	} catch (error) {
		next(error);
	}
};

export const renderFortniteHome = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const shop = await loadShop();
		res.render('./fortnite/index.ejs', { title: 'Fortnite', user: res.locals.user, shop });
	} catch (error) {
		next(error);
	}
};