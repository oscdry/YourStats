const BRAWL_API_ENDPOINT = 'https://api.brawlstars.com/v1/';
const playerTagEX = 'YCQLVQV';
const playerTagEX2 = 'LR2PV2J2';
import { config } from 'dotenv';
import Pino from '../../logger.js';
import { ExternalServiceError, UserNotFoundError } from '../errors/errors.js';

config();

const apiKey = process.env.BRAWL_API_KEY;
if (!apiKey)
	throw new Error('No Brawl API Key in env');


export const brawlRecentBattle = async (battletag: string): Promise<{
	resumeMatch: any[];
	mostPlayedmode: [string, number][];
	gameNamesrepeated: [string, number][];
} | null> => {
	const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + battletag + '/battlelog', {
		headers: {
			'Authorization': 'Bearer ' + apiKey,
			'Content-Type': 'application/json'
		}
	});

	Pino.trace('Fetching to ' + BRAWL_API_ENDPOINT + 'players/%23' + battletag + '/battlelog');

	// Else, user not found
	if (result.status === 404) {
		throw new UserNotFoundError();
	} else if (result.status === 403) {
		Pino.trace(result + ' | ' + result.status + ' | ' + result.statusText);
		throw new ExternalServiceError();

	}

	const json = await result.json();

	const resumeMatch: any[] = [];
	const modosJuego: { [key: string]: number; } = {};
	const nombresJugadores: string[] = [];

	if (Array.isArray(json.items)) {
		json.items.slice(0, 10).forEach((item: any) => {
			const event = item.event;
			const battle = item.battle;

			if (modosJuego[event.mode]) {
				modosJuego[event.mode]++;
			} else {
				modosJuego[event.mode] = 1;
			}

			let teams: any[] = [];

			if (event.mode === 'soloShowdown') {
				const jugadoresSoloShowdown: any[] = item.battle.players;
				jugadoresSoloShowdown.forEach((jugador: any) => {
					const isTagMatch = jugador.tag === battletag;
					teams.push([
						{
							Nombrejugador: jugador.name,
							tag: jugador.tag,
							nombreBrawler: jugador.brawler ? jugador.brawler.name : null,
							idBrawler: jugador.brawler ? jugador.brawler.id : null,
							isStarPlayer: isTagMatch && item.battle.starPlayer && jugador.tag === item.battle.starPlayer.tag
						}
					]);
					if (!isTagMatch) {
						nombresJugadores.push(jugador.name);
					}
				});
			} else {
				if (Array.isArray(item.battle.teams)) {
					item.battle.teams.forEach((team: any) => {
						const jugadores: any[] = [];

						team.forEach((player: any) => {
							const isStarPlayer = item.battle.starPlayer && player.tag === item.battle.starPlayer.tag;
							jugadores.push({
								Nombrejugador: player.name,
								tag: player.tag,
								nombreBrawler: player.brawler ? player.brawler.name : null,
								idBrawler: player.brawler ? player.brawler.id : null,
								isStarPlayer: isStarPlayer
							});

							if (player.tag !== battletag) {
								nombresJugadores.push(player.name);
							}
						});

						teams.push(jugadores);
					});
				}
			}

			const matchData = {
				idBrawlerPasadoPorTag: null,
				nombreBrawlerPasadoPorTag: null,
				modo: event.mode,
				mapa: event.map,
				tipo: battle.type,
				duracion: battle.duration
			};

			teams.forEach((equipo: any[]) => {
				equipo.forEach((jugador: any) => {
					if (jugador.tag === battletag && jugador.idBrawler) {
						matchData.idBrawlerPasadoPorTag = jugador.idBrawler;
						matchData.nombreBrawlerPasadoPorTag = jugador.nombreBrawler;
					}
				});
			});

			const partida = {
				teams: teams,
				matchData: matchData
			};

			resumeMatch.push(partida);
		});
	} else {
		Pino.error('La propiedad \'items\' no es un array en el objeto JSON.');
	}

	const contadorNombresJugadores: { [key: string]: number; } = {};
	nombresJugadores.forEach((nombre: string) => {
		if (contadorNombresJugadores[nombre]) {
			contadorNombresJugadores[nombre]++;
		} else {
			contadorNombresJugadores[nombre] = 1;
		}
	});

	const modosJuegoOrdenados = Object.entries(modosJuego).sort((a, b) => b[1] - a[1]);

	const nombresJugadoresOrdenados = Object.entries(contadorNombresJugadores).sort((a, b) => b[1] - a[1]);

	return {
		resumeMatch: resumeMatch,
		mostPlayedmode: modosJuegoOrdenados,
		gameNamesrepeated: nombresJugadoresOrdenados.slice(0, 3)
	};
};


export const brawlInfo = async (battletag: string): Promise<{
	user: object;
	imgID: string;
	brawlers: any[];
} | null> => {

	const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + battletag, {
		headers: {
			'Authorization': 'Bearer ' + apiKey,
			'Content-Type': 'application/json'
		}
	});

	Pino.trace('Fetching to ' + BRAWL_API_ENDPOINT + 'players/%23' + battletag);


	if (result.status === 403) {
		const json = await result.json();
		Pino.trace('Brawl info result: ' + json.reason + ' | ' + result.status + ' | ' + result.statusText + ' | ' + json.message);
		throw new ExternalServiceError();
	} else if (result.status !== 200) {
		Pino.error('Error fetching to Brawl API: ' + result.status + ' | ' + result.statusText);
		throw new UserNotFoundError();
	}

	const userData = await result.json();
	const user = {
		tag: userData.tag,
		name: userData.name,
		trophies: userData.trophies,
		highestTrophies: userData.highestTrophies,

		// Increíble que traiga la variable con numeros 🤮
		trioVictories: userData['3vs3Victories'],
		soloVictories: userData.soloVictories,
		duoVictories: userData.duoVictories
	};

	const sortByTrophies = userData.brawlers.sort(
		(a: { trophies: number; }, b: { trophies: number; }) => b.trophies - a.trophies);
	const topBrawlersByTrophies = sortByTrophies;

	const brawlers = topBrawlersByTrophies.sort(
		(a: { highestTrophies: number; }, b: { highestTrophies: number; }
		) => b.highestTrophies - a.highestTrophies)
		.map((brawler: { id: any; name: any; power: any; gears: any; trophies: any; highestTrophies: any; starPowers: any; gadgets: any; }) => (
			{
				id: brawler.id,
				name: brawler.name,
				power: brawler.power,
				gears: brawler.gears,
				trophies: brawler.trophies,
				highestTrophies: brawler.highestTrophies,
				starPowers: brawler.starPowers,
				gadgets: brawler.gadgets
			}
		));

	const iconId = userData.icon.id;
	const imgID = 'https://media.brawltime.ninja/avatars/' + iconId + '.webp';

	return { user, imgID, brawlers };
};

export const getRankingSpain = async () => {

	const result = await fetch(BRAWL_API_ENDPOINT + 'rankings/es/players', {
		headers: {
			'Authorization': 'Bearer ' + process.env.BRAWL_API_KEY,
			'Content-Type': 'application/json'
		}

	});

	if (result.status === 403) {
		const json = await result.json();
		Pino.trace('Brawl info result: ' + json.reason + ' | ' + result.status + ' | ' + result.statusText + ' | ' + json.message);
		throw new ExternalServiceError();
	} else if (result.status !== 200) {
		Pino.error('Error fetching to Brawl API: ' + result.status + ' | ' + result.statusText);
	}

	const data = await result.json();
	const primeros5Jugadores = data.items.slice(0, 5);

	Pino.trace('Fetched brawl ranking Spain');
	return primeros5Jugadores;
};


export const getRankingGlobal = async () => {

	const result = await fetch(BRAWL_API_ENDPOINT + 'rankings/global/players', {
		headers: {
			'Authorization': 'Bearer ' + process.env.BRAWL_API_KEY,
			'Content-Type': 'application/json'
		}

	});
	const data = await result.json();

	// console.log(data.items);
	const primeros5Jugadores = data.items.slice(0, 5);

	Pino.trace('Fetched brawl ranking Global');
	return primeros5Jugadores;
};
interface Player {
	tag: string;
	name: string;
	nameColor: string;
	icon: {
		id: number;
	};
	trophies: number;
	rank: number;
	club: {
		name: string;
	};
}

interface BrawlHomeData {
	rankSpain: Player[];
	rankGlobal: Player[];
	skinsBrawls: {
		name: string;
		'image-url': string;
		'release-date': string;
	}[];
}
interface BrawlData {
	resumenPartidas: {
		equipos: {
			Nombrejugador: string;
			tag: string;
			nombreBrawler: string | null;
			idBrawler: number | null;
			isStarPlayer: boolean;
		}[][];
		datosPartida: {
			idBrawlerPasadoPorTag: number | null;
			nombreBrawlerPasadoPorTag: string | null;
			modo: string;
			mapa: string;
			tipo: string;
			duracion: number;
		};
	}[];
	modosJuegoMasJugados: [string, number][];
	nombresJugadoresMasRepetidos: [string, number][];
	usuarioBrawlInfo: {
		user: {
			tag: string;
			name: string;
			trophies: number;
			highestTrophies: number;
			trioVictories: number;
			soloVictories: number;
			duoVictories: number;
		};
		imgID: string;
		brawlers: {
			id: number;
			name: string;
			power: number;
			gears: number;
			trophies: number;
			highestTrophies: number;
			starPowers: string[];
			gadgets: string[];
		}[];
	};
}

export const GetBrawlData = async (playerTagEX: string): Promise<BrawlData | null> => {
	const partidas = await brawlRecentBattle(playerTagEX);
	const infoJugador = await brawlInfo(playerTagEX);

	if (!partidas) {
		Pino.warn('El usuario: ' + playerTagEX + ' no tiene partidas de brawl');
		return null;
	}

	if (!infoJugador) {
		Pino.error('No se ha encontrado datos de brawl para el jugador: ' + playerTagEX);
		return null;
	}


	Pino.trace(JSON.stringify(partidas));
	Pino.trace(JSON.stringify(infoJugador));

	return {
		resumenPartidas: partidas.resumeMatch.map((partida: any) => ({
			equipos: partida.teams,
			datosPartida: partida.matchData
		})),
		modosJuegoMasJugados: partidas.mostPlayedmode,
		nombresJugadoresMasRepetidos: partidas.gameNamesrepeated,
		usuarioBrawlInfo: {
			user: infoJugador.user,
			imgID: infoJugador.imgID,
			brawlers: infoJugador.brawlers
		}
	};
};

export const GetBrawlHomeData = async (): Promise<BrawlHomeData> => {

	const [rankingGlobal, rankingSpain] = await Promise.all(
		[getRankingGlobal(), getRankingSpain()]
	);

	const skinsBrawls = [
		{
			'name': 'Holiday Pam',
			'image-url': 'https://imagenesparapeques.com/wp-content/uploads/2020/12/Brawl-Stars-pam-veraniega.png',
			'release-date': '25 june 2020'
		},
		{
			'name': 'Chester Loki',
			'image-url': 'https://www.brawlstarsdicas.com.br/wp-content/uploads/2022/12/chester-brawl-stars-skin-cetro-de-loki.png',
			'release-date': '4 apr 2024'
		},
		{
			'name': 'Dynasty Mike',
			'image-url': 'https://static.wikia.nocookie.net/brawlstars/images/4/40/Dynamike_Skin-Dynasty_Mike.png',
			'release-date': '5 mar 2024'
		},
		{
			'name': 'Mariposa piper',
			'image-url': 'https://server.blix.gg/imgproxy/KyQLh3Rm99ZeABxCJxO4J48HGn74Gdoz2WiZBV_3sac/rs:fit:260:260:0/g:no/aHR0cDovL21pbmlvOjkwMDAvaW1hZ2VzLzQxNWI3MDM3MzY3MzQ5NjY5NGZlYTkyMjc1YjI2NzkyLnBuZw.webp',
			'release-date': '8 mar 2023'
		},
		{
			'name': 'Final Boss Rico',
			'image-url': 'https://static.wikia.nocookie.net/brawlstars/images/b/bf/Rico_Skin-Final_Boss.png',
			'release-date': '5 jan 2024'
		}
	];

	return {
		rankSpain: rankingSpain,
		rankGlobal: rankingGlobal,
		skinsBrawls: skinsBrawls
	};
};


// console.log(await GetBrawlData('YCQLVQV'));




//console.log(await GetHomeData());
//console.log(await getRankingSpain());
// console.log(JSON.stringify(await GetBrawlData(playerTagEX)));
//console.log(await brawlInfo(playerTagEX));