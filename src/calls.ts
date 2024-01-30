const LOL_API_ENDPOINT = "https://euw1.api.riotgames.com/lol/";
const RIOT_API_ENDPOINT = "https://europe.api.riotgames.com";
const BRAWL_API_ENDPOINT = "https://api.brawlstars.com/v1";
const OSU_API_ENDPOINT = "https://osu.ppy.sh/api/v2/";

const TRACKER_GG_ENDPOINT = "https://public-api.tracker.gg/v2/csgo/standard/profile/";

export const RiotPUUIDByTagName = async (gameName: string, tagLine: string): Promise<string> => {
    const result = await fetch(RIOT_API_ENDPOINT + '/riot/account/v1/accounts/by-riot-id/' + gameName + '/' + tagLine, {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); return ""; }

    const json = await result.json();
    return json["puuid"];
};

export const RiotCallExample = async () => {
    const result = await fetch(LOL_API_ENDPOINT + 'status/v4/platform-data', {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
};

export const BrawlCallExample = async () => {
    const result = await fetch(BRAWL_API_ENDPOINT + '/brawlers?limit=76', {
        headers: { "Authorization": "Bearer " + process.env.BRAWL_API_TOKEN }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
};

export const Cs2CallExample = async (userId :  string, platform : string = "steam") => {
    console.log(process.env.TRN_API_KEY);

    const result = await fetch(TRACKER_GG_ENDPOINT + platform +'/' + userId, {
        headers: { "TRN-Api-Key": process.env.TRN_API_KEY! }
    });
    if (result.status != 200) { console.log("Error"); }

    const json = await result.json();
    console.log(json);
};