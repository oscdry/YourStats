export interface BrawlPlayer {
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

export interface BrawlHomeData {
	rankSpain: BrawlPlayer[];
	rankGlobal: BrawlPlayer[];
	skinsBrawls: {
		name: string;
		'image-url': string;
		'release-date': string;
	}[];
}

export interface BrawlData {
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