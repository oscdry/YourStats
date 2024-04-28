import { NextFunction, Request, Response } from 'express';
import { GetFortniteData, getFortniteShopData, loadShop, getFortniteBanner } from '../services/forniteServices.js';
import { getAccountbyId } from '../services/riotServices.js';

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

export const renderFortniteUserStats = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userTag = req.params.tag;
		const fortnitedata = await GetFortniteData(userTag);
		res.render('./fortnite/fortnite-user-stats.ejs', { title: 'Fortnite Stats', user: res.locals.user, fortnitedata });
	} catch (error) {
		next(error);
	}
};