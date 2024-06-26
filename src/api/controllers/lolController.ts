import { NextFunction, Request, Response } from 'express';
import { RiotDataByName } from '../services/riotServices.js';
import { GetLolHomeData, GetLolUserData, RiotStatusServer } from '../services/lolServices.js';
import Pino from '../../logger.js';
import { SkinNotFoundError, UserNotFoundError } from '../errors/errors.js';
import { searchSkinByName } from '../services/lolSkinsServices.js';

/**
 * Comprueba si un usuario de Riot existe para un nombre de usuario dado.
 * @param req
 * @param res
 * @param next Devuelve el error a errorHandler
 */
export const RiotUserExists = async (req: Request, res: Response, next: NextFunction) => {
	const userName = req.body.username;
	const tag = req.body.tag;
	try {
		const user = await RiotDataByName(userName, tag);
		if (user?.puuid) {
			res.sendStatus(200);
		}
		Pino.error('Lol User not found');
	} catch (error) {
		next(error);
	}
};

/**
 * Envía los datos de un usuario de League of Legends en JSON.
 * @param req
 * @param res
 * @param next
 */
export const SendLolData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userName = req.params.username;
		const userTAG = req.params.gameTAG;
		return res.json(await GetLolUserData(userName, userTAG));
	} catch (error) {
		next(error);
	}
};
export const SendLolHomeData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		return res.json(await GetLolHomeData());
	} catch (error) {
		next(error);
	}
};

export const sendLolSkin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skinName = req.params.skinName;
		return res.json(await searchSkinByName(skinName));
	} catch (error) {
		next(error);
	}
};

/**
 * Renderiza el home de League of Legends.
 * @param _req
 * @param res
 * @param next
 */
export const RenderLolIndex = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const server = await RiotStatusServer();
		const data = await GetLolHomeData();
		res.render('./lol/index.ejs', { title: 'LoL', server, homedata: data, user: res.locals.user });
	} catch (error) {
		Pino.error('Error rendering LoL index: ' + (error as Error).message);
		next(error);
	}
};

/**
 * Renderiza la página de estadísticas de un usuario de League of Legends.
 * @param req
 * @param res
 * @param next
 */
export const renderLolStatsForPlayer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const gameName: string = req.params.gamename;
		const gameTAG: string = req.params.gameTAG;
		const loldata = await GetLolUserData(gameName, gameTAG);
		if (!loldata) throw new UserNotFoundError();

		Pino.info('rendering ' + loldata.gameName + ' stats ' + loldata.gamesLast7Days);

		const lolPositionsChartData = {
			type: 'pie',
			data: {
				labels: Object.keys(loldata.games.teamPositionCount),
				datasets: [{
					label: 'Position',
					data: Object.values(loldata.games.teamPositionCount),
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(54, 162, 235)',
						'rgb(255, 205, 86)',
						'rgb(75, 192, 192)',
						'rgb(153, 102, 255)'
					],
					hoverOffset: 4
				}]
			},
			options: {
				responsive: true, // this will make the chart responsive
				maintainAspectRatio: false // this allows you to set a custom size
			}
		};
const lolKdaLastMatchesChartData = {
			type: 'line',
			data: {
				labels: Object.keys(loldata.games.resultsArray.map((game) => game.championIdentifier.championName)),
				datasets: [{
					label: 'KDA',
					data: Object.values(loldata.games.resultsArray).map((game) => game.kda).reverse(),
					fill: false,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1
				}]
			},
			options: {
				responsive: true, // this will make the chart responsive
				maintainAspectRatio: false // this allows you to set a custom size
			}
		};


		const lolCompChartData = {
			type: 'bar',
			data: {
				labels: loldata.games.friendsMost.map(item => item[0]),
				datasets: [{
					label: 'Games Played',
					data: loldata.games.friendsMost.map(item => item[1]),
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(54, 162, 235)',
						'rgb(255, 205, 86)'
					],
					hoverOffset: 4
				}]
			}
		};

		return res.render('./lol/lol-user-stats.ejs', { title: 'LoL Stats', loldata, lolPositionsChartData, lolCompChartData, playername: gameName, user: res.locals.user, lolKdaLastMatchesChartData });
	} catch (error) {
		const message = (error as Error).message;
		const name = (error as Error).name;
		Pino.error('Error getting stats' + name + message);

		next(error);
	}
};

export const renderLolSearchSkins = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skinName: string = req.params.gamename;
		const loldata = await searchSkinByName(skinName);
		if (!loldata) throw new SkinNotFoundError();


		return res.render('./lol/lol-skins-index.ejs', { title: 'LoL Skins', loldata, user: res.locals.user });
	} catch (error) {
		const message = (error as Error).message;
		const name = (error as Error).name;
		Pino.error('Error getting stats' + name + message);

		next(error);
	}
};

export const renderLolSkins = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await GetLolHomeData();
		if (!data) throw new SkinNotFoundError();


		return res.render('./lol/lol-skins-index.ejs', { title: 'LoL Skins', homedata: data, user: res.locals.user });

		
	} catch (error) {
		const message = (error as Error).message;
		const name = (error as Error).name;
		Pino.error('Error getting stats' + name + message);

		next(error);
	}
};