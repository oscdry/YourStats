export interface LolHomeData {

	summonerDetails: [
		summoners: {
			summoneName: string,
			leaguePoints: number,
			champTAG: string,
		}

	];
	champList: [
		champs: {
			champName: string,
			champId: number,
		}
	];

	popularSkins: [
		skins: {
			champName: string,
			skinURL: string,
			skinName: string,
			skinNombre: string,
			price: number,
		}
	];

	newSkins: [
		skins: {
			name: string,
			releaseDate: string,
			wishlistStatus: string,
			popularity: string,
			cost: number,
			imageURL: string,
			landscapeURL: string,
			chromaURL: string,
		}
	];
}



export interface LoLUserData {
	iconID: string;
	gamesLast7Days: string;
	gameName: string;
	gameTAG: string;
	games:
	{
		resultsArray: [
			championIdentifier: {
				championName: string,
				championId: string;
			},
			isWinner: boolean,
			stats: {
				kills: number,
				deaths: number,
				assists: number,
			},
			gameMode: string,
			kda: string,
			arrayItems: number[],
			teamID: string,
			teamPosition: string,
			arrayTeammates: string[],
			arrayBlue: string[],
			arrayRed: string[],
			friendsMost: [string, number][],
			teamPositionCount: { [position: string]: number; }

		];
		friendsMost: [string, number][];
		teamPositionCount: { [position: string]: number; };
	};
	tier: string;
	rank: string;
	points: number;
	wins: number;
	losses: number;
	total: number;
	championsMasteryData: [
		championId: number,
		championPoints: number
	];
}


export interface ChampionStats {
	kills: number;
	deaths: number;
	assists: number;
}

export interface ChampionIdentifier {
	championName: string;
	championId: number;
}

export interface LoLGameChampWinResponse {
	championIdentifier: ChampionIdentifier;
	isWinner: boolean;
	arrayItems: number[];
	stats: ChampionStats;
	kda: string;
	gameMode: string;

	teamID: string;

	teamPosition: string;
	arrayTeammates: { [nombre: string]: { champID: string; gameTAG: string; }; };
	arrayBlue: { [nombre: string]: { champID: string; gameTAG: string; }; };
	arrayRed: { [nombre: string]: { champID: string; gameTAG: string; }; };
}