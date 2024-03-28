const BRAWL_API_ENDPOINT = "https://api.brawlstars.com/v1/";

const playerTagEX = "#ROGQUJQC2";

import { config } from "dotenv";
import Pino from "../../logger.js";
config();
import {brawlerList} from "./brawlList.js";

export const brawlRecentBattle = async (battletag: string) => {
    const newBattletag = battletag.substring(1);
    const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag + '/battlelog', {
        headers: {
            "Authorization": "Bearer " + process.env.BRAWL_API_KEY!,
            "Content-Type": "application/json"
        }
    });

    if (result.status !== 200) {
        console.log(result.status);
        return;
    }

    const json = await result.json();
    console.log(json);
};

export const brawlInfo = async (battletag: string) => {
    const newBattletag = battletag.substring(1);
    const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag , {
        headers: {
            "Authorization": "Bearer " + process.env.BRAWL_API_KEY!,
            "Content-Type": "application/json"
        }
    });

    if (result.status !== 200) {
        console.log(result.status);
        return;
    }

    const json = await result.json();
    console.log(json);
};



console.log(await brawlRecentBattle(playerTagEX));