const LOL_API_ENDPOINT = 'https://euw1.api.riotgames.com/lol/';
const RIOT_API_ENDPOINT = 'https://europe.api.riotgames.com';

import { config } from 'dotenv';
import Pino from '../../logger.js';
import { RiotDataByName } from './riotServices.js';
import { RiotPUUIDbySum } from './riotServices.js';
import { RiotgetPUUIDInfo } from './riotServices.js';
import { getAccountbyId } from './riotServices.js';
import { getNewSkins } from './lolSkinsServices.js';
import { ExternalServiceError } from '../errors/errors.js';
import { ChampionIdentifier, ChampionStats, LolHomeData, LoLUserData } from '../types/lolTypes.js';

config();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

if (!RIOT_API_KEY) {
	Pino.error('RIOT API key not found');
	process.exit(1);
}

// Status de la plataforma del League of Legends
export const RiotStatusServer = async (): Promise<{
	id: string,
	name: string,
	locales: string[],
	maintenances: any[],
	incidents: any[],
}> => {
	try {
		const result = await fetch(LOL_API_ENDPOINT + 'status/v4/platform-data', {
			headers: { 'X-Riot-Token': RIOT_API_KEY }
		});

		if (result.status === 403) { throw new ExternalServiceError(); }

		if (result.status != 200) {
			Pino.error('Error fetching lol server status: ' + result.statusText);
		}
		const json = await result.json();
		return json;
	} catch (error) {
		throw error;
	}
};

// Mostrar el Ranking de los mejores jugadores (los pasa todos)
/**
 * @deprecated
 */
export const LolRanking = async () => {
	const result = await fetch(LOL_API_ENDPOINT + 'league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();
};

// Mostrar el Ranking de los 3 mejores jugadores (esta funciona)
export const LolRankingDemo = async () => {
	const result = await fetch(LOL_API_ENDPOINT + 'league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	if (result.status !== 200) {
		Pino.error('Error fetching lol rank: ' + result.statusText);
	}

	const json = await result.json();
	const sortedData = json.entries.sort(
		(a: { leaguePoints: number; },
			b: { leaguePoints: number; }) => b.leaguePoints - a.leaguePoints);

	const topUsers = sortedData.slice(0, 5);

	const summonerData = topUsers.map((player: {
		summonerId: string,
		leaguePoints: number;
	}) => ({
		summonerId: player.summonerId,
		leaguePoints: player.leaguePoints
	}));

	for (let player of summonerData) {
		const summonerId = player.summonerId;

		//console.log(summonerId);
		const puuid = await getAccountbyId(summonerId);

		//console.log(puuid);
		const summonerName = await RiotPUUIDbySum(puuid);

		//console.log(summonerName);
		player.summonerName = summonerName;
	}

	//console.log(topUsers);
	const summonerDetails = summonerData.map(
		({ summonerName, leaguePoints }: { summonerName: string, leaguePoints: number; }) => ({ summonerName, leaguePoints }));
	return summonerDetails;
};

// Esta muestra los tres campeones mas jugados de cada usuario
export const LoLMostPlayed = async (puuid: string): Promise<{ championID: number, championPoints: number; }[]> => {
	const result = await fetch(LOL_API_ENDPOINT + 'champion-mastery/v4/champion-masteries/by-puuid/' + puuid + '/top?count=3', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();
	const championsMasteryData = json.map((champion: { championId: number, championPoints: number; }) => {
		return { championID: champion.championId, championPoints: champion.championPoints };
	});

	return championsMasteryData;
};

// Muestra datos de Usuario como: Partidas gnadas,perdidas, totales,puntos de liga , rango y tier
export const LoLRankById = async (Id: string): Promise<LoLUserData | null> => {
	if (!Id) {
		return null;
	}

	const result = await fetch(LOL_API_ENDPOINT + 'league/v4/entries/by-summoner/' + Id, {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});

	if (result.status != 200) {
		Pino.error('Error fetching lol rank by id: ' + result.statusText);
	}

	const json = await result.json();
	const entry = Array.isArray(json) ? json[0] : json;

	if (!entry) {
		Pino.trace('Usuario sin rango');
		return null;
	}

	const tier: string = entry.tier;
	const rank: string = entry.rank;
	const points: number = entry.leaguePoints;
	const wins: number = entry.wins;
	const losses: number = entry.losses;
	const total: number = wins + losses;

	return { tier, rank, points, wins, losses, total };
};

// Muestra las ultimas diez partidas
export const LoLGamesByUUID = async (Puiid: string): Promise<string> => {
	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + Puiid + '/ids?start=0&count=10', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();
	return json;
};


// Muestra los detalles de cada partida
export const LoLGameDetail = async (GameID: string): Promise<string> => {

	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/' + GameID, {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();
	return json;
};

// Busca que campeón jugo el usuario en cada partida jugada
export const LoLGameChampUser = async (GameID: string, Puiid: string): Promise<string> => {
	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/' + GameID, {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});

	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();
	const participant = json.info.participants.find((participant: any) => participant.puiid === Puiid);
	if (!participant) {
		console.log('No se encontró el jugador en la partida');
	}
	const championName = participant.championName;
	return championName;
};

// Filtro de partidas por fecha de inicio y fecha final
export const LoLGamesByUUIDFilter = async (Puiid: string, fecha1: string, fecha2: string): Promise<string> => {
	const fechaT1 = new Date(fecha1);
	const fechaT2 = new Date(fecha2);

	const timestampInicio = fechaT1.getTime() / 1000;
	const timestampFinal = fechaT2.getTime() / 1000;

	// console.log(timestampInicio);
	// console.log(timestampFinal);
	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + Puiid + '/ids?startTime=' + timestampInicio + '&endTime=' + timestampFinal + '&start=0&count=10', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();

	// console.log(json);
	return json;
};

// Numero de partidas jugadas los últimos 7 dias
export const LoLGamesLast7days = async (Puiid: string): Promise<string | null> => {
	if (!Puiid) return null;

	const fechaCompleta = new Date();

	const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
	const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
	fechaT2.setDate(fechaT2.getDate() - 7);

	const timestampActual = fechaT1.getTime() / 1000;
	const timestamp10 = fechaT2.getTime() / 1000;

	Pino.trace('fetching to ' + RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + Puiid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=100');

	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + Puiid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=100', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});

	if (result.status != 200) { console.log('Error'); }

	const json = await result.json();

	// console.log(json);
	return json.length;
};

//Ultimas 10 partidas con detalle de cada una

export const LoLChampsLast10Games = async (Puiid: string): Promise<string> => {

	const fechaCompleta = new Date();

	const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
	const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
	fechaT2.setDate(fechaT2.getMonth() - 2);

	const timestampActual = fechaT1.getTime() / 1000;
	const timestamp10 = fechaT2.getTime() / 1000;

	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + Puiid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=10', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});

	if (result.status != 200) { console.log('Error'); }

	const json1 = await result.json();
	let elementos_array: string[] = [];
	json1.forEach((elemento: string) => {
		elementos_array.push(elemento);
	});

	// TODO: que es esto
	// for (const elemento of elementos_array) {
	// Pino.trace(await LoLGameChampUser(elemento, Puiid));
	// }

	return json1;
};

// Detalle ultimas 10 partidas con estadísticas incluidas, los items, si ganó,etc
export const LoLGameChampWin = async (GameID: string, puuid: string): Promise<{
	championIdentifier: ChampionIdentifier,
	isWinner: boolean,
	arrayItems: number[],
	stats: ChampionStats,
	kda: string,
	gameMode: string,
	teamID: string,
	teamPosition: string,
	arrayTeammates: { [nombre: string]: { champID: string; gameTAG: string; }; },
	arrayBlue: { [nombre: string]: { champID: string; gameTAG: string; }; },
	arrayRed: { [nombre: string]: { champID: string; gameTAG: string; }; };
} | null> => {

	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/' + GameID, {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});

	if (result.status != 200) {
		console.log('Error');
		return null;
	}

	const json = await result.json();


	const participant = json.info.participants.find((participant: any) => participant.puuid === puuid);
	if (!participant) {
		console.log('No se encontró el jugador en la partida');
		return null;
	}

	const stats = { kills: participant.kills, deaths: participant.deaths, assists: participant.assists };

	const kda = ((participant.kills + participant.assists) / participant.deaths).toFixed(2);

	const championIdentifier = { championName: participant.championName, championId: participant.championId };
	const isWinner = participant.win;
	const arrayItems = [participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item6];
	const gameMode = json.info.gameMode;
	const teamID = participant.teamId;

	let enemyteamID = 1;
	if (teamID == 200) {
		enemyteamID = 100;
	} else if (teamID == 100) {
		enemyteamID = 200;
	}
	const teamPosition = participant.teamPosition;
	const arrayTeammates: { [nombre: string]: { champID: string; gameTAG: string; }; } = {};
	const arrayRivals: { [nombre: string]: { champID: string; gameTAG: string; }; } = {};

	if (gameMode == 'ARAM') {
		json.info.participants.forEach((p: any) => {
			if (p.teamId === teamID) {
				arrayTeammates[p.riotIdGameName] = {
					champID: p.championId,
					gameTAG: p.riotIdTagline
				};
			}
		});
		json.info.participants.forEach((p: any) => {
			if (p.teamId === enemyteamID) {
				arrayRivals[p.riotIdGameName] = {
					champID: p.championId,
					gameTAG: p.riotIdTagline
				};
			}
		});
	} else {
		json.info.participants.forEach((p: any) => {
			if (p.teamId === teamID) {
				if (p.teamPosition === 'TOP') {
					arrayTeammates[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'JUNGLE') {
					arrayTeammates[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'MIDDLE') {
					arrayTeammates[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'BOTTOM') {
					arrayTeammates[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'UTILITY') {
					arrayTeammates[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				}
			}
		});
		json.info.participants.forEach((p: any) => {
			if (p.teamId === enemyteamID) {
				if (p.teamPosition === 'TOP') {
					arrayRivals[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'JUNGLE') {
					arrayRivals[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'MIDDLE') {
					arrayRivals[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'BOTTOM') {
					arrayRivals[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				} else if (p.teamPosition === 'UTILITY') {
					arrayRivals[p.riotIdGameName] = {
						champID: p.championId,
						gameTAG: p.riotIdTagline
					};
				}
			}
		});

	}
	let arrayBlue: { [nombre: string]: { champID: string; gameTAG: string; }; } = {};
	let arrayRed: { [nombre: string]: { champID: string; gameTAG: string; }; } = {};
	if (teamID == 100) {
		arrayBlue = arrayTeammates;
		arrayRed = arrayRivals;
	} else if (teamID == 200) {
		arrayBlue = arrayRivals;
		arrayRed = arrayTeammates;
	}

	return {
		championIdentifier, isWinner, arrayItems, stats,
		kda, gameMode, teamID, teamPosition, arrayTeammates,
		arrayBlue, arrayRed
	};
};

export const LoLWinrateChamps = async (Puiid: string, gameName: string) => {

	const fechaCompleta = new Date();

	const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
	const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
	fechaT2.setDate(fechaT2.getMonth() - 2);

	const timestampActual = fechaT1.getTime() / 1000;
	const timestamp10 = fechaT2.getTime() / 1000;

	const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + Puiid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=10', {
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});

	if (result.status != 200) { console.log('Error'); }

	const matchIds = await result.json();
	const resultsArray: any[] = [];

	for (const matchId of matchIds) {
		const result = await LoLGameChampWin(matchId, Puiid);
		if (!result) continue;
		resultsArray.push(result);
	}

	const teammatesPlayed: { [name: string]: number; } = {};
	resultsArray.forEach(game => {
		const teammatesinGame = game.arrayTeammates
			;

		for (const name in teammatesinGame) {
			if (teammatesinGame.hasOwnProperty(name)) {
				if (teammatesPlayed[name]) {
					teammatesPlayed[name]++;
				} else {
					teammatesPlayed[name] = 1;
				}
			}
		}
	});

	const teamPositionCount: { [position: string]: number; } = {};
	const teamAramPositionCount: { [position: string]: number; } = {};

	resultsArray.forEach(game => {
		const position = game.teamPosition;
		if (position) {
			if (teamPositionCount[position]) {
				teamPositionCount[position]++;
			} else {
				teamPositionCount[position] = 1;
			}
		}
	});

	let totalPositions = 0;
	resultsArray.forEach(game => {
		let position = game.teamPosition;
		if (position) {
			if (teamAramPositionCount[position]) {
				teamAramPositionCount[position]++;
			} else {
				teamAramPositionCount[position] = 1;
			}

			totalPositions++;
		}
	});

	const aramDifference = 10 - totalPositions;
	if (aramDifference > 0) {
		teamPositionCount['ARAM'] = aramDifference;
	}

	const teamFilter: [string, number][] = Object.entries(teammatesPlayed);
	teamFilter.sort((a, b) => b[1] - a[1]);
	const mostPlayed = teamFilter.slice(0, 4);
	const friendsMost = mostPlayed.filter(([nombre, _]) => nombre !== gameName);

	return { resultsArray, friendsMost, teamPositionCount };
};

export function getLastChamps(): Record<string, number> {
	const playersData: Record<string, number> = {
		Smolder: 901,
		Huawei: 910,
		Briar: 233,
		Naafiri: 950,
		Milio: 902
	};

	return playersData;
}

export function getPopularSkins(): {
	champName: string;
	skinURL: string;
	skinName: string;
	skinNombre: string;
	price: number;
}[] {
	const popularSkins = [
		{
			champName: 'Ezreal',
			skinURL: 'https://www.mobafire.com/images/champion/skins/portrait/ezreal-pulsefire.jpg',
			skinName: 'Pulsefire Ezreal',
			skinNombre: 'Ezreal Pulso de Fuego',
			price: 3250
		},
		{
			champName: 'Ahri',
			skinURL: 'https://www.mobafire.com/images/champion/skins/portrait/ahri-foxfire.jpg',
			skinName: 'Foxfire Ahri',
			skinNombre: 'Ahri Raposa Ígnea',
			price: 975
		},
		{
			champName: 'Udyr',
			skinURL: 'https://www.mobafire.com/images/champion/skins/portrait/udyr-spirit-guard.jpg',
			skinName: 'Spirit Guard Udyr',
			skinNombre: 'Udyr Guardián de los Espíritus',
			price: 3250
		},
		{
			champName: 'Justicar Aatrox',
			skinURL: 'https://www.mobafire.com/images/champion/skins/portrait/aatrox-justicar.jpg',
			skinName: 'Justicar Aatrox',
			skinNombre: 'Aatrox Justicia Suprema',
			price: 975
		},
		{
			champName: 'Soul Reaver Draven',
			skinURL: 'https://www.mobafire.com/images/champion/skins/portrait/draven-soul-reaver.jpg',
			skinName: 'Soul Reaver Draven',
			skinNombre: 'Draven Segador de Almas',
			price: 1350
		}
	];
	return popularSkins;
}

//
const gameTAG = 'FNC';
const Gamename = 'OSCDRY';
const puuid = 'g8CgWhodK_EZCY1Zc6PzcRMbk-ePqtOkMQguiKxUPTESGJq3Wnmbh9SgkUKD1l_0Pykk_oUd4ne9aw';

//console.log(await LoLGamesByUUID(Gamename));
//console.log(await LoLGamesByUUIDFilter(Gamename,dia1,dia2));
//console.log(await LoLChampsLast10Games(Gamename));
//console.log(await LoLMostPlayed(Gamename));
//console.log(LoLGameDetail(GameID));
//console.log(LoLGameChampUser(GameID,Gamename));
//console.log(await LoLGamesLast10days(Gamename));
//console.log(await LoLWinrateChamps(puuid, Gamename));
//console.log(await LoLGameChampWin(aramID, puuid));
//console.log(await LoLRankById(Gamename));
//console.log(await RiotStatusServer());
// console.log(await LolRankingDemo());
//console.log(await LoLMostPlayed(Gamename));

/**
 * Función que devuelve los datos de un usuario de League of Legends
 * @param gameName
 * @returns Un objeto con todos los datos del usuario
 */
export const GetLolUserData = async (gameName: string, gameTAG: string): Promise<LoLUserData | null> => {
	const data = await RiotDataByName(gameName, gameTAG);
	const urlImage = 'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/';
	const puuid = data?.puuid;
	if (!puuid) {
		Pino.warn('No se encontró el usuario ' + gameName
			+ ' en la base de datos de Riot');
		return null;
	}
	const data2 = await RiotgetPUUIDInfo(puuid);
	const preIcon = data2?.profileIconId;
	const iconID = urlImage + preIcon + '.png';


	const summonerId = data2.id;
	const [numGames, LoLWinrateChamp, userData, userPlayed] = await Promise.all([
		LoLGamesLast7days(puuid),
		LoLWinrateChamps(puuid, gameName),
		LoLRankById(summonerId),
		LoLMostPlayed(puuid)
	]);

	const lolData: LoLUserData = {
		iconID: iconID,
		gamesLast7Days: numGames ? numGames : '0',
		gameName: gameName,
		gameTAG: gameTAG,
		games: LoLWinrateChamp,
		tier: userData ? userData.tier : 'Unranked',
		rank: userData ? userData.rank : '',
		points: userData ? userData.points : 0,
		wins: userData ? userData.wins : 0,
		losses: userData ? userData.losses : 0,
		total: userData ? userData.total : 0,
		championsMasteryData: userPlayed
	};

	// Pino.debug(JSON.stringify(lolData));
	Pino.trace('Datos de usuario de LoL obtenidos correctamente');
	return lolData;
};

export const GetLolHomeData = async (): Promise<LolHomeData> => {

	const ranking = await LolRankingDemo();
	const list = getLastChamps();
	const skins = getPopularSkins();
	const newSkins = getNewSkins();

	const LolHomeData: LolHomeData = {
		summonerDetails: ranking,
		champList: list,
		popularSkins: skins,
		newSkins: newSkins
	};

	// Pino.debug(JSON.stringify(LolHomeData));
	return LolHomeData;
};

