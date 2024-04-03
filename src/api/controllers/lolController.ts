import { NextFunction, Request, Response } from 'express';
import { RiotDataByName } from '../services/riotServices.js';
import { GetLolUserData } from '../services/lolServices.js';
import Pino from '../../logger.js';
import { UserNotFoundError } from '../errors/errors.js';

/**
 * Comprueba si un usuario de Riot existe para un nombre de usuario dado.
 * @param req
 * @param res
 * @param next Devuelve el error a errorHandler
 */
export const riotUserExists = async (req: Request, res: Response, next: NextFunction) => {
	const userName = req.body.username;

	try {
		const user = await RiotDataByName(userName);
		if (user?.puuid) {
			res.sendStatus(200);
		}
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
export const sendLolData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userName = req.params.username;
		return res.json(await GetLolUserData(userName));
	} catch (error) {
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
		const loldata = await GetLolUserData(req.params.gamename);
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
			}
		};

		return res.render('./lol/lol-user-stats.ejs', { title: 'LoL Stats', loldata, lolPositionsChartData });
	} catch (error) {
		const message = (error as Error).message;
		const name = (error as Error).name;
		Pino.error('Error getting stats' + name + message);

		next(error);
	}
};