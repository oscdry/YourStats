import { UserNotFoundError } from '../errors/errors.js';

const FORTNITE_API_ENDPOINT = 'https://fortnite-api.com/v2/stats/br/v2/';

import { config } from 'dotenv';
import Pino from '../../logger.js';
import { ExternalServiceError, UserNotFoundError } from '../errors/errors.js';

config();

export const getFortniteShopData = async (language: string) => {
	const API_ENDPOINT = 'https://fortnite-api.com/v2/shop/br';

	const url = `${API_ENDPOINT}?language=${language}`;

	const response = await fetch(url);

	if (response.status !== 200) {
		console.log('Error:', response.statusText);
		return null;
	}

	const json = await response.json();
    
	return json;
};

export const getFortniteStatsByAccountId = async (name, accountType = 'epic', timeWindow = 'lifetime', image = 'none'): Promise<any> => {

	const apiKey = process.env.FORTNITE_API_KEY!;
    
	const url = `${FORTNITE_API_ENDPOINT}?name=${name}&accountType=${accountType}&timeWindow=${timeWindow}&image=${image}`;
	console.log(url);
	const response = await fetch(url, {
		headers: {
			'Authorization': apiKey
		}
	});
	if (response.status !== 200) {
		console.log('Error:', response.statusText);
		return null;
	}

	const json = await response.json();
    
	const account = json.data.account;
	const battlePass = json.data.battlePass;
	const stats = json.data.stats;
	const allStats = stats.all;
	return {account, battlePass, allStats};
};


export const getFortniteBanner = async (randNumber): Promise<any> => {

	const apiKey = process.env.FORTNITE_API_KEY!;
    
	const url = 'https://fortnite-api.com/v1/banners';
	console.log(url);
	const response = await fetch(url, {
		headers: {
			'Authorization': apiKey
		}
	});
	if (response.status !== 200) {
		console.log('Error:', response.statusText);
		return null;
	}
	
	const json = await response.json();
	const image = json.data[randNumber];
	return image;
};




const accountId = 'Twitch Beliiize';
const language = 'en';
const number = 5;


interface FortniteBanner {
	id: string;
	devName: string;
	name: string;
	description: string;
	category: string;
	fullUsageRights: boolean;
	images: {
		smallIcon: string;
		icon: string;
	};
}

interface BattlePass {
	level: number;
	progress: number;
}

interface Account {
	id: string;
	name: string;
}

interface Stats {
	score: number;
	scorePerMin: number;
	scorePerMatch: number;
	wins: number;
	top3: number;
	top5: number;
	top6: number;
	top10: number;
	top12: number;
	top25: number;
	kills: number;
	killsPerMin: number;
	killsPerMatch: number;
	deaths: number;
	kd: number;
	matches: number;
	winRate: number;
	minutesPlayed: number;
	playersOutlived: number;
	lastModified: string; 
}
  
interface AllStats {
	overall: Stats;
	solo: Stats;
	duo: Stats;
	trio: Stats | null;
	squad: Stats;
	ltm: Stats | null;
}

interface FortniteData {
	account: Account;
	battlePass: BattlePass;
	allStats: AllStats;
	banner: FortniteBanner
}


export const GetFortniteData = async (playerTagEX: string): Promise<FortniteData> => {
	const fakerandomNumber = playerTagEX.length;
	const banner = await getFortniteBanner(fakerandomNumber);
	const infoJugador = await getFortniteStatsByAccountId(playerTagEX);

	Pino.trace(JSON.stringify(banner));
	Pino.trace(JSON.stringify(infoJugador));

	const data: FortniteData = {
		account: {
			id: infoJugador.account.id,
			name: infoJugador.account.name
		},
		battlePass: {
			level: infoJugador.battlePass.level,
			progress: infoJugador.battlePass.progress
		},
		allStats: {
			overall: infoJugador.allStats.overall,
			solo: infoJugador.allStats.solo,
			duo: infoJugador.allStats.duo,
			trio: infoJugador.allStats.trio,
			squad: infoJugador.allStats.squad,
			ltm: infoJugador.allStats.ltm
		},
		banner: banner
	};

	return data;
};

console.log(JSON.stringify(await GetFortniteData(accountId)));

//console.log( JSON.stringify(await getFortniteStatsByAccountId(accountId)));   

//console.log(await getFortniteBanner(number));
