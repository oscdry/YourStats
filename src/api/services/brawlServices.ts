const BRAWL_API_ENDPOINT = "https://api.brawlstars.com/v1/";
const playerTagEX = "#YCQLVQV";
const playerTagEX2 = "#LR2PV2J2"
import { config } from "dotenv";
config();



export const brawlRecentBattle = async (battletag: string) => {
  const newBattletag = battletag.substring(1);
  const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag + '/battlelog', {
    headers: {
      "Authorization": "Bearer " + process.env.BRAWL_API_KEY,
      "Content-Type": "application/json"
    }
  });
  if (result.status !== 200) {
    console.log(result.status);
    return;
  }
  const json = await result.json();

  const resumeMatch: any[] = [];
  const modosJuego: { [key: string]: number } = {};
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

      if (event.mode === "soloShowdown") {
        const jugadoresSoloShowdown: any[] = item.battle.players;
        jugadoresSoloShowdown.forEach((jugador: any) => {
          const isTagMatch = jugador.tag === battletag;
          teams.push([
            {
              Nombrejugador: jugador.name,
              tag: jugador.tag ,
              nombreBrawler: jugador.brawler ? jugador.brawler.name: null,
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
                nombreBrawler: player.brawler ? player.brawler.name: null,
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
    console.log("La propiedad 'items' no es un array en el objeto JSON.");
  }

  const contadorNombresJugadores: { [key: string]: number } = {};
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





export const brawlInfo = async (battletag: string) => {
  const newBattletag = battletag.substring(1);
  const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag, {
    headers: {
      "Authorization": "Bearer " + process.env.BRAWL_API_KEY,
      "Content-Type": "application/json"
    }
  });
  if (result.status !== 200) {
    console.log(result.status);
    return;
  }
  const userData = await result.json();
  const user = {
    tag: userData.tag,
    name: userData.name,
    trophies: userData.trophies,
    highestTrophies: userData.highestTrophies,
    '3vs3Victories': userData['3vs3Victories'],
    soloVictories: userData.soloVictories,
    duoVictories: userData.duoVictories
  };
  const sortByTrophies = userData.brawlers.sort((a, b) => b.trophies - a.trophies);
  const topBrawlersByTrophies = sortByTrophies.slice(0, 10);
  const brawlers = topBrawlersByTrophies.sort((a, b) => b.highestTrophies - a.highestTrophies).slice(0, 3).map(brawler => ({
    id: brawler.id,
    name: brawler.name,
    power: brawler.power,
    gears: brawler.gears,
    trophies: brawler.trophies,
    highestTrophies: brawler.highestTrophies,
    starPowers: brawler.starPowers,
    gadgets: brawler.gadgets
  }));
  const iconId = userData.icon.id;
  const imgID = "https://media.brawltime.ninja/avatars/" + iconId + ".webp?size=200";
  return { user, imgID, brawlers };
};


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
      '3vs3Victories': number;
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

export const GetBrawlData = async (playerTagEX: string): Promise<BrawlData> => {
  const partidas = await brawlRecentBattle(playerTagEX);
  const infoJugador = await brawlInfo(playerTagEX);

  return {
    resumenPartidas: partidas.resumeMatch.map((partida: any) => ({
      equipos: partida.teams,
      datosPartida: partida.matchData,
    })),
    modosJuegoMasJugados: partidas.mostPlayedmode,
    nombresJugadoresMasRepetidos: partidas.gameNamesrepeated,
    usuarioBrawlInfo: {
      user: infoJugador.user,
      imgID: infoJugador.imgID,
      brawlers: infoJugador.brawlers,
    },
  };
};
console.log(JSON.stringify(await GetBrawlData(playerTagEX)));
//console.log(await brawlInfo(playerTagEX));
