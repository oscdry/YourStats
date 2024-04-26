export interface LolHomeData {

	summonerDetails: [
		summoners: {
			summoneName: string,
			leaguePoints: number,
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
	games: [
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