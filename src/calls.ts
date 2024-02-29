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

export const RiotDataByName = async (Gamename: string): Promise<string> => {
    const result = await fetch(LOL_API_ENDPOINT + 'summoner/v4/summoners/by-name/'+ Gamename, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    
    return json;
};

export const LoLRankById = async (Gamename: string): Promise<string> => {
    const {id} = await RiotDataByName(Gamename);
    console.log(id);
    const result = await fetch(LOL_API_ENDPOINT + 'league/v4/entries/by-summoner/'+ id, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};

export const LoLGamesByUUID = async (Gamename: string): Promise<string> => {
    const {puuid} = await RiotDataByName(Gamename);
    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/'+ puuid +'/ids?start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};

export const LoLGameDetail = async (GameID: string): Promise<string> => {

    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/'+ GameID, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};
export const LoLGameChampUser = async (GameID: string, Gamename: string): Promise<string> => {

    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/'+ GameID, {
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
export const LoLGamesByUUIDFilter = async (Gamename: string, fecha1: string, fecha2: string ): Promise<string> => {
    const {puuid} = await RiotDataByName(Gamename);
    const fechaT1 = new Date (fecha1);
    const fechaT2 = new Date (fecha2);

    const timestampInicio = fechaT1.getTime() / 1000;
    const timestampFinal = fechaT2.getTime() / 1000;

    console.log(timestampInicio);
    console.log(timestampFinal);
    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/'+ puuid +'/ids?startTime=' + timestampInicio + '&endTime=' +timestampFinal + '&start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
    return json;
};
export const LoLGamesLast10days = async (Gamename: string): Promise<string> => {
    const {puuid} = await RiotDataByName(Gamename);

    const fechaCompleta = new Date ();
    
    const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());;
    const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
    fechaT2.setDate(fechaT2.getDate() - 10);

   

    const timestampActual = fechaT1.getTime() / 1000;
    const timestamp10 = fechaT2.getTime() / 1000;

    
    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/'+ puuid +'/ids?startTime=' + timestamp10 + '&endTime=' +timestampActual + '&start=0&count=100', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });

    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    
    console.log(json);
    return json.length;
};

export const LoLChampsLast10Games = async (Gamename: string): Promise<string> => {
    const {puuid} = await RiotDataByName(Gamename);

    const fechaCompleta = new Date ();
    
    const fechaT1 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());;
    const fechaT2 = new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate());
    fechaT2.setDate(fechaT2.getMonth() - 2);

   

    const timestampActual = fechaT1.getTime() / 1000;
    const timestamp10 = fechaT2.getTime() / 1000;

    
    const result = await fetch(RIOT_API_ENDPOINT + '/lol/match/v5/matches/by-puuid/'+ puuid +'/ids?startTime=' + timestamp10 + '&endTime=' +timestampActual + '&start=0&count=10', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });

    if (result.status != 200) { console.log("Error"); }

    const json1 = await result.json();
    let elementos_array: string[] = [];
    json1.forEach((elemento : string) => {
        elementos_array.push(elemento);
    });
    for (const elemento of elementos_array) {
       console.log(await LoLGameChampUser(elemento, Gamename));
    }
    
    return json1;
};
const Gamename = 'DonMarios'; 
const GameID = 'EUW1_6826301175';
const dia1 = '2024-01-01';
const dia2 = '2024-02-22';
//console.log(await LoLGamesByUUID(Gamename));  
//console.log(await LoLGamesByUUIDFilter(Gamename,dia1,dia2));
console.log(await LoLChampsLast10Games(Gamename));
//console.log(LoLGameDetail(GameID));
//console.log(LoLGameChampUser(GameID,Gamename));
//console.log(await LoLGamesLast10days(Gamename));