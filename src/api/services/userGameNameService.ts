import Pino from '../../logger.js';
import prismaClient from '../db/dbConnections.js';
import firestore from '../db/firebaseConnections.js';
import { GetBrawlData } from './brawlServices.js';
import { getFortniteStatsByAccountId } from './forniteServices.js';
import { GetLolUserData } from './lolServices.js';

// Upserts the db table, (inserts if not exists, updates if exists)
export const updateUserGameUsernamesService = async (userId: string, gameNames: {
	lol: string | null;
	brawl: string | null;
	fortnite: string | null;
}) => {
	await prismaClient.userGameName.upsert({
		where: {
			id: userId
		},
		create: {
			id: userId,
			points: 0,
			lol: gameNames.lol ? gameNames.lol : '',
			brawl: gameNames.brawl ? gameNames.brawl : '',
			fortnite: gameNames.fortnite ? gameNames.fortnite : '',
			lol_points: 0,
			brawl_points: 0,
			fortnite_points: 0
		},
		update: {
			lol: gameNames.lol ? gameNames.lol : '',
			brawl: gameNames.brawl ? gameNames.brawl : '',
			fortnite: gameNames.fortnite ? gameNames.fortnite : ''
		}
	});

	Pino.debug('Game names updated for user: ' + userId);
};

const updateUserPointsService = async (userId: string, data: {
	points: number;
	lol_points: number;
	brawl_points: number;
	fortnite_points: number;
}) => {
	const result = await prismaClient.userGameName.update({
		where: {
			id: userId
		},
		data: {
			points: data.points,
			lol_points: data.lol_points,
			brawl_points: data.brawl_points,
			fortnite_points: data.fortnite_points
		}
	});

	Pino.debug('Points updated for user: ' + userId);
	return result;
};

const calculateLolRankPoints = (rank: string) => {
	switch (rank) {
		case 'I':
			return 100;
		case 'II':
			return 90;
		case 'III':
			return 80;
		case 'IV':
			return 70;
		default:
			return 0;
	}
};

const calculateLolTierPoints = (tier: string, rank: string) => {
	switch (tier) {
		case 'IRON':
			return 0 + calculateLolRankPoints(rank);
		case 'BRONZE':
			return 100 + calculateLolRankPoints(rank);
		case 'SILVER':
			return 200 + calculateLolRankPoints(rank);
		case 'GOLD':
			return 300 + calculateLolRankPoints(rank);
		case 'PLATINUM':
			return 400 + calculateLolRankPoints(rank);
		case 'DIAMOND':
			return 500 + calculateLolRankPoints(rank);
		case 'MASTER':
			return 600 + calculateLolRankPoints(rank);
		case 'GRANDMASTER':
			return 700 + calculateLolRankPoints(rank);
		case 'CHALLENGER':
			return 800 + calculateLolRankPoints(rank);
		default:
			return 0;
	}
};

export const calculateAndSaveUserPointsService = async (userId: string): Promise<{
	points: number;
	lol_points: number;
	brawl_points: number;
	fortnite_points: number;
}> => {
	const userRow = await prismaClient.userGameName.findUnique({
		where: {
			id: userId
		}
	});

	if (!userRow) {
		Pino.warn('User not found calculating stats: ' + userId);
		return {
			points: 0,
			lol_points: 0,
			brawl_points: 0,
			fortnite_points: 0
		};
	}

	Pino.trace('Calculating user points for ' + userId + ' with names ' + userRow.lol + ', ' + userRow.brawl + ', ' + userRow.fortnite);

	let totalPoints = 0;

	let lolPoints = 0;
	let brawlPoints = 0;
	let fortnitePoints = 0;

	// Get data from all games
	const [lolData, brawlData, fortniteData] = await Promise.all([
		userRow.lol ? GetLolUserData(
			userRow.lol.split('#')[0],
			userRow.lol.split('#')[1]
		) : null,
		userRow.brawl ? GetBrawlData(userRow.brawl) : null,
		userRow.fortnite ? getFortniteStatsByAccountId(userRow.fortnite) : null
	]);

	// Calculations ------

	// Add points from lol
	// 1 game = 35 points
	// +win = 70 points

	// 1 Mastery point = 0.1 points
	if (lolData) {
		lolPoints += calculateLolRankPoints(lolData.rank);
		lolPoints += lolData.total * 35;
		lolPoints += lolData.wins * 70;

		let champPoints = lolData.championsMasteryData.reduce((sum, champion) => sum + champion.championPoints, 0);

		lolPoints += champPoints * 0.1;
	}

	Pino.trace('Total points from lol for ' + userRow.lol + ': ' + totalPoints);
	totalPoints += lolPoints;

	// Add points from brawl
	// 1 trophy = 0.2 points
	// 1 soloVictory = 3 points
	// 1 duoVictory = 5 points
	// 1 trioVictory = 5 points
	if (brawlData) {
		brawlPoints += brawlData.usuarioBrawlInfo.user.trophies * 0.2;
		brawlPoints += brawlData.usuarioBrawlInfo.user.soloVictories * 3;
		brawlPoints += brawlData.usuarioBrawlInfo.user.duoVictories * 5;
		brawlPoints += brawlData.usuarioBrawlInfo.user.trioVictories * 5;
	}

	Pino.trace('Total points from brawl for ' + userRow.brawl + ': ' + totalPoints);
	totalPoints += brawlPoints;

	// Add points from fortnite
	// 1 Battlepass level = 5 points
	// 1 soloVictory = 100 points
	// 1 duoVictory = 75 points
	// 1 trioVictory = 50 points
	// 1 squadVictory = 40 points
	if (fortniteData) {
		fortnitePoints += fortniteData.battlePass.level * 5;
		fortnitePoints += fortniteData.allStats.solo ? fortniteData.allStats.solo.wins * 100 : 0;
		fortnitePoints += fortniteData.allStats.duo ? fortniteData.allStats.duo.wins * 75 : 0;
		fortnitePoints += fortniteData.allStats.trio ? fortniteData.allStats.trio.wins * 50 : 0;
		fortnitePoints += fortniteData.allStats.squad ? fortniteData.allStats.squad.wins * 40 : 0;
	}

	Pino.trace('Total points from fortnite for ' + userRow.fortnite + ': ' + totalPoints);
	totalPoints += fortnitePoints;

	const row = updateUserPointsService(userId, {
		points: totalPoints,
		lol_points: lolPoints,
		brawl_points: brawlPoints,
		fortnite_points: fortnitePoints
	});
	return row;
};

export const getUserPointsService = async (userId: string): Promise<{
	points: number;
	lol_points: number;
	brawl_points: number;
	fortnite_points: number;
	position: number;
}> => {
	const userRow = await prismaClient.userGameName.findUnique({
		where: {
			id: userId
		}
	});

	if (!userRow) {
		Pino.warn('User not found getting points: ' + userId);
		return {
			points: 0,
			lol_points: 0,
			brawl_points: 0,
			fortnite_points: 0,
			position: 0
		};
	}


	const position = await prismaClient.userGameName.count({
		where: {
			points: {
				gt: userRow.points
			}
		}
	});

	return {
		...userRow,
		position: position + 1
	};
};

// Returns best 5 users of YourStats
export const getBest5UsersService = async (): Promise<Array<{
	id: string;
	username: string;
	points: number;
	lol_points: number;
	brawl_points: number;
	fortnite_points: number;
	position: number;
}>> => {
	const users = await prismaClient.userGameName.findMany({
		orderBy: {
			points: 'desc'
		},
		take: 5
	});

	const result = await Promise.all(users.map(async (user, index) => {
		const [position, username] = await Promise.all([
			prismaClient.userGameName.count({
				where: {
					points: {
						gt: user.points
					}
				}
			}),
			(await firestore.collection('users').doc(user.id).get()).data()
		]);

		return {
			...user,
			username: username ? username.username : 'Unknown',
			position: position + 1
		};
	}));
	return result;
};