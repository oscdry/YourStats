import { Router, type Response, type Request, NextFunction } from 'express';
import { renderUserView } from '../api/controllers/userController.js';
import { lolTestData } from '../api/types/testData/lolTestData.js';
import { RenderLolIndex, renderLolStatsForPlayer } from '../api/controllers/lolController.js';
import { brawlTestData } from '../api/types/testData/brawlTestData.js';
import { RenderBrawlStats } from '../api/controllers/brawlController.js';

const webRouter = Router();

// Not found page
export const NotFoundPage = (_req: Request, res: Response) => {
	res.status(404).render('404.ejs', { title: 'Page not found', user : res.locals.user});
};

// Error page
export const RenderErrorPage = (res: Response) => {
	res.status(500).render('500.ejs', { title: 'Error', user : res.locals.user });
};

// Páginas publicas
webRouter.get('/', (_req: Request, res: Response) => {
	res.render('index', { title: 'Inicio', user: res.locals.user });
});

webRouter.get('/user/:id', renderUserView);

webRouter.get('/about', (_req: Request, res: Response) => {
	res.render('./about.ejs', { title: 'Contacto', user: res.locals.user });
});

webRouter.get('/password-reset/:token');

// Brawl Stars ---------------------------------------------------------
webRouter.get('/brawl', (_req: Request, res: Response) => {
	res.render('./brawl/index.ejs', { title: 'Brawl Stars', user: res.locals.user });
});

//! Testing routes Brawl Stars
webRouter.get('/brawl/stats/asd', async (_req: Request, res: Response, next: NextFunction) => {
	return res.render('./brawl/brawl-user-stats.ejs', { title: 'Brawl Stats', brawldata: brawlTestData });
});

webRouter.get('/brawl/stats/:tag', RenderBrawlStats);

// League of Legends ---------------------------------------------------------
webRouter.get('/lol', RenderLolIndex);

//! Testing routes League of Legends
webRouter.get('/lol/stats/asd', async (_req: Request, res: Response, next: NextFunction) => {

	const lolPositionsChartData = {
		type: 'pie',
		data: {
			labels: Object.keys(lolTestData.games.teamPositionCount),
			datasets: [{
				label: 'Position',
				data: Object.values(lolTestData.games.teamPositionCount),
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

	return res.render('./lol/lol-user-stats.ejs', { title: 'LoL Stats', loldata: lolTestData, lolPositionsChartData, playername: 'OSCDRY' });
});

webRouter.get('/lol/stats/chart', async (_req: Request, res: Response, next: NextFunction) => {

	let chartdata = {
		type: 'bar',
		data: {
			labels: ['Q1', 'Q2', 'Q3', 'Q4'],
			datasets: [{
				label: 'Users',
				data: [50, 60, 70, 180]
			}, {
				label: 'Revenue',
				data: [100, 200, 300, 400]
			}]
		}
	};

	const dataPie = {
		type: 'pie',
		data: {
			labels: [
				'Red',
				'Blue',
				'Yellow'
			],
			datasets: [{
				label: 'My First Dataset',
				data: [65, 59, 80, 81, 56, 55, 40],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}]
		}
	};

	const dataLine = {
		type: 'line',
		data: {
			labels: [
				'Red',
				'Blue',
				'Yellow'
			],
			datasets: [{
				label: 'My First Dataset',
				data: [300, 50, 100],
				backgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(54, 162, 235)',
					'rgb(255, 205, 86)'
				],
				hoverOffset: 4
			}]
		}
	};

	const dataDonut = {
		type: 'doughnut',
		data: {
			labels: [
				'Wins',
				'Losses'
			],
			datasets: [{
				data: [300, 50],
				backgroundColor: [
					'rgb(71, 202, 163)',
					'rgb(255, 108, 108)'
				],
				hoverOffset: 4
			}]
		}
	};


	res.render('./lol/lol-user-stats.ejs', { title: 'LoL Stats Chart', loldata: lolTestData, chartdata: dataDonut });
});

webRouter.get('/lol/stats/:gamename', renderLolStatsForPlayer);

export default webRouter;