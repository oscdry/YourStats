const LOL_API_ENDPOINT = "https://euw1.api.riotgames.com/lol/";
const RIOT_API_ENDPOINT = "https://europe.api.riotgames.com";
const OSU_API_ENDPOINT = "https://osu.ppy.sh/api/v2/";

import { config } from "dotenv";

config();

export const RiotPUUIDByTagName = async (gameName: string, tagLine: string): Promise<string> => {
    const result = await fetch(RIOT_API_ENDPOINT + '/riot/account/v1/accounts/by-riot-id/' + gameName + '/' + tagLine, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); return ""; }

    const json = await result.json();
    return json["puuid"];
};

export const RiotStatusServer = async () => {
    const result = await fetch(LOL_API_ENDPOINT + 'status/v4/platform-data', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
};
export const LolRanking = async () => {
    const result = await fetch(LOL_API_ENDPOINT + 'league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
};

export const LolRankingDemo = async () => {
    const result = await fetch(LOL_API_ENDPOINT + 'league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status !== 200) { console.log("Error"); }

    const json = await result.json();

    const sortedData = json.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);

    const topUsers = sortedData.slice(0, 3);

    const summonerDetails = topUsers.map(({ summonerName, leaguePoints }) => ({ summonerName, leaguePoints }));
    

    return summonerDetails;
};

export const LoLMostPlayed = async (Gamename: string): Promise<{ championID: number, championPoints: number }[]> => {
    const { puuid } = await RiotDataByName(Gamename);
    const result = await fetch(LOL_API_ENDPOINT + 'champion-mastery/v4/champion-masteries/by-puuid/' + puuid + '/top?count=3', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    const championsMasteryData = json.map((champion: { championId: number, championPoints: number }) => {
        return { championID: champion.championId, championPoints: champion.championPoints };
    });

    return championsMasteryData;
};

export const RiotDataByName = async (gameName: string): Promise<string | null> => {
    const result = await fetch(LOL_API_ENDPOINT + 'summoner/v4/summoners/by-name/' + gameName, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { return null; }

    const json = await result.json();

    return json;
};

export const LoLRankById = async (Gamename: string): Promise<string> => {
    const { id } = await RiotDataByName(Gamename);
    const result = await fetch(LOL_API_ENDPOINT + 'league/v4/entries/by-summoner/' + id, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    const entry = Array.isArray(json) ? json[0] : json;

    const tier: string = entry.tier;
    const rank: string = entry.rank;
    const points: number = entry.leaguePoints;
    const wins: number = entry.wins;
    const loses: number = entry.losses;
    const total: number = wins + loses;

    return { tier, rank, points, wins, loses, total };
};

export const LoLGamesByUUID = async (Gamename: string): Promise<string> => {
    const { puuid } = await RiotDataByName(Gamename);
    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};

export const LoLGameDetail = async (GameID: string): Promise<string> => {

    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/' + GameID, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};
export const LoLGameChampUser = async (GameID: string, Gamename: string): Promise<string> => {

    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/' + GameID, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    const participant = json.info.participants.find((participant: any) => participant.riotIdGameName === Gamename);
    if (!participant) {
        console.log("No se encontró el jugador en la partida");
    }
    const championName = participant.championName;
    return championName;
};
export const LoLGamesByUUIDFilter = async (Gamename: string, fecha1: string, fecha2: string): Promise<string> => {
    const { puuid } = await RiotDataByName(Gamename);
    const fechaT1 = new Date(fecha1);
    const fechaT2 = new Date(fecha2);

    const timestampInicio = fechaT1.getTime() / 1000;
    const timestampFinal = fechaT2.getTime() / 1000;

    console.log(timestampInicio);
    console.log(timestampFinal);
    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + timestampInicio + '&endTime=' + timestampFinal + '&start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};

export const LoLGamesLast7days = async (Gamename: string): Promise<string | null> => {
    const puuid = await RiotDataByName(Gamename);
    if (!puuid) return null;

    const fechaCompleta = new Date();

    const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());;
    const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
    fechaT2.setDate(fechaT2.getDate() - 7);



    const timestampActual = fechaT1.getTime() / 1000;
    const timestamp10 = fechaT2.getTime() / 1000;


    console.log("fetching to " + RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=100');

    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=100', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });

    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();

    console.log(json);
    return json.length;
};

export const LoLChampsLast10Games = async (gameName: string): Promise<string> => {
    const { puuid } = await RiotDataByName(gameName);

    const fechaCompleta = new Date();

    const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());;
    const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
    fechaT2.setDate(fechaT2.getMonth() - 2);



    const timestampActual = fechaT1.getTime() / 1000;
    const timestamp10 = fechaT2.getTime() / 1000;


    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });

    if (result.status != 200) { console.log("Error"); }

    const json1 = await result.json();
    let elementos_array: string[] = [];
    json1.forEach((elemento: string) => {
        elementos_array.push(elemento);
    });
    for (const elemento of elementos_array) {
        console.log(await LoLGameChampUser(elemento, gameName));
    }

    return json1;
};




export const LoLGameChampWin = async (GameID: string, Gamename: string): Promise<{ championName: string, isWinner: boolean; } | null> => {

    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/' + GameID, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });

    if (result.status != 200) {
        console.log("Error");
        return null;
    }

    const json = await result.json();
    const participant = json.info.participants.find((participant: any) => participant.riotIdGameName === Gamename);

    if (!participant) {
        console.log("No se encontró el jugador en la partida");
        return null;
    }

    const stats = { kills: participant.kills, deaths: participant.deaths, assists: participant.assists };

    const kda = (participant.kills + participant.assists) / participant.deaths;

    const championIdentifier = { championName: participant.championName, championId: participant.championId };
    const isWinner = participant.win;
    const arrayItems = [participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item5, participant.item6];
    const gameMode = json.info.gameMode;

    return { championIdentifier, isWinner, arrayItems, stats, kda, gameMode };

};

export const LoLWinrateChamps = async (Gamename: string)  => {
    const { puuid } = await RiotDataByName(Gamename);

    const fechaCompleta = new Date();

    const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());;
    const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
    fechaT2.setDate(fechaT2.getMonth() - 2);



    const timestampActual = fechaT1.getTime() / 1000;
    const timestamp10 = fechaT2.getTime() / 1000;


    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + timestamp10 + '&endTime=' + timestampActual + '&start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });

    if (result.status != 200) { console.log("Error"); }

    const matchIds = await result.json();
    const resultsArray: any[] = [];

    for (const matchId of matchIds) {
        const result = await LoLGameChampWin(matchId, Gamename);
        if (!result) continue;
        resultsArray.push(result);
    }
    return resultsArray;
};


const Gamename = 'OSCDRY';
const GameID = 'EUW1_6826301175';
const dia1 = '2024-01-01';
const dia2 = '2024-02-22';

//console.log(await LoLGamesByUUID(Gamename));
//console.log(await LoLGamesByUUIDFilter(Gamename,dia1,dia2));
//console.log(await LoLChampsLast10Games(Gamename));
//console.log(await LoLMostPlayed(Gamename));
//console.log(LoLGameDetail(GameID));
//console.log(LoLGameChampUser(GameID,Gamename));
//console.log(await LoLGamesLast10days(Gamename));
//console.log(await LoLWinrateChamps(Gamename));
//console.log(await LoLRankById(Gamename));
//console.log(await RiotStatusServer());
//console.log(await LolRankingDemo());
//console.log(await LoLMostPlayed(Gamename));
console
export const GetLolUserData = async (gameName: string): Promise<LoLUserData> => {
    const numGames = await LoLGamesLast7days(gameName);
    const LoLWinrateChamp = await LoLWinrateChamps(gameName);
    const userData = await LoLRankById(Gamename);
    const userPlayed = await LoLMostPlayed(Gamename);

    const lolData : LoLUserData ={
        gameName : gameName,
        gamesLast7Days : numGames,
        games : LoLWinrateChamp,
        tier: userData.tier,
        rank: userData.rank,
        points: userData.points,
        wins: userData.wins,
        loses: userData.loses,
        total: userData.total,
        championsMasteryData: userPlayed,        
    }
    return  lolData ;

};

interface LoLUserData {
    gamesLast7Days: string;
    gameName: string;
    games: [
        championIdentifier: {
        championName: string,
        championId: string
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
    ];
    tier: string;
    rank: string;
    points: number;
    wins: number;
    loses: number;
    total: number;
    championsMasteryData: [
        championId: number,
        championPoints: number,
    ];
    

};




interface LolHomeData{

    summonerDetails: [
        summoneName: string,
        leaguePoints: number,
    ]
    
}


console.log(JSON.stringify( await GetLolUserData(Gamename)));