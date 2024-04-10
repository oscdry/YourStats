import { UserNotFoundError } from '../errors/errors.js';

const LOL_API_ENDPOINT = 'https://euw1.api.riotgames.com/lol/';
const RIOT_API_ENDPOINT = 'https://europe.api.riotgames.com';

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


export const RiotDataByName = async (gameName: string): Promise<RiotData | null> => {
	const result = await fetch(LOL_API_ENDPOINT + 'summoner/v4/summoners/by-name/' + gameName, {
		headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! }
	});
	if (result.status != 200) { throw new UserNotFoundError(); }

	const json = await result.json();
	return json;
};
