import { NextFunction, Request, Response } from 'express';
import { brawlInfo, GetBrawlData, GetHomeData } from '../services/brawlServices.js';
import { UserNotFoundError } from '../errors/errors.js';


export const BrawlUserExists = async (req: Request, res: Response, next: NextFunction) => {
	const userTag = req.body.tag;

	try {
		const user = await brawlInfo(userTag);
		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};

export const SendBrawlData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userTag = req.params.tag;
		return res.json(await GetBrawlData(userTag));
	} catch (error) {
		next(error);
	}
};
export const SendBrawlHomeData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		return res.json(await GetHomeData());
	} catch (error) {
		next(error);
	}
};
export const RenderBrawlStats = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userTag = req.params.tag;
		const brawlData = await GetBrawlData(userTag);

		if (!brawlData)
			throw new UserNotFoundError();

		return res.render('./brawl/brawl-user-stats.ejs', { title: 'Brawl Stats', brawldata: brawlData });
	} catch (error) {
		next(error);
	}

};