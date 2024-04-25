import Pino from '../../logger.js';
import { UserNotFoundError } from '../errors/errors.js';
import { config } from 'dotenv';

const LOL_API_ENDPOINT = 'https://euw1.api.riotgames.com/lol/';
const RIOT_API_ENDPOINT = 'https://europe.api.riotgames.com';

config();

interface RiotData {
	id: string,
	accountId: string,
	puuid: string,
	name: string,
	profileIconId: number,
	revisionDate: number,
	summonerLevel: number;

}

export const RiotPUUIDByTagName = async (gameName: string, tagLine: string): Promise<string> => {
	const result = await fetch(RIOT_API_ENDPOINT + '/riot/account/v1/accounts/by-riot-id/' + gameName + '/' + tagLine, {
		headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! }
	});
	if (result.status != 200) { console.log('Error'); return ''; }

	const json = await result.json();

	return json['puuid'];
};




export const getAccountbyId = async (id: string): Promise<string> => {
	const result = await fetch(LOL_API_ENDPOINT + 'summoner/v4/summoners/' + id, {
		headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! }
	});
	if (result.status != 200) { console.log('Error'); return ''; }

	const json = await result.json();

	return json['puuid'];


};

export const RiotDataByName = async (gameName: string): Promise<RiotData | null> => {
	const result = await fetch(LOL_API_ENDPOINT + 'summoner/v4/summoners/by-name/' + gameName, {
		headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! }
	});
	if (result.status != 200) {
		Pino.error(result.status + ' ' + result.statusText);
		throw new UserNotFoundError();
	}

	const json = await result.json();
	return json;
};


export const RiotPUUIDbySum = async (puuid: string): Promise<String | null> => {
	const result = await fetch(RIOT_API_ENDPOINT + '/riot/account/v1/accounts/by-puuid/' + puuid, {
		headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! }
	});
	if (result.status != 200) { throw new UserNotFoundError(); }

	const json = await result.json();
	return json['gameName'];
};
const sumID = 'wBhJMT4Ej_VbawTcrmYBI5cVxSxbL9fp5A2MFozj6gq6V6Y';

//console.log(await getAccountbyId(sumID));
