const BRAWL_API_ENDPOINT = 'https://api.brawlstars.com/v1/';

const playerTagEX = '#YCQLVQV';

import { config } from 'dotenv';
config();

export const brawlRecentBattle = async (battletag: string) => {
	const newBattletag = battletag.substring(1);
	const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag + '/battlelog', {
		headers: {
			'Authorization': 'Bearer ' + process.env.BRAWL_API_KEY!,
			'Content-Type': 'application/json'
		}
	});

	if (result.status !== 200) {
		console.log(result.status);
		return;
	}

	const json = await result.json();
	console.log(json);
};

export const brawlInfo = async (battletag: string) => {
	const newBattletag = battletag.substring(1);
	const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag, {
		headers: {
			'Authorization': 'Bearer ' + process.env.BRAWL_API_KEY!,
			'Content-Type': 'application/json'
		}
	});

	if (result.status !== 200) {
		console.log(result.status);
		return;
	}

	const json = await result.json();
	console.log(json);
};

console.log(await brawlRecentBattle(playerTagEX));
console.log(await brawlInfo(playerTagEX));