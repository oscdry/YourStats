import { UserNotFoundError } from '../errors/errors.js';

const FORTNITE_API_ENDPOINT = 'https://fortnite-api.com/v2/stats/br/v2/';

import { config } from 'dotenv';
config();

export const getFortniteShopData = async (language : string ) => {
    const API_ENDPOINT = 'https://fortnite-api.com/v2/shop/br';

    const url = `${API_ENDPOINT}?language=${language}`;

    const response = await fetch(url);

    if (response.status !== 200) {
        console.log('Error:', response.statusText);
        return null;
    }

    const json = await response.json();
    return json;
};

export const getFortniteStatsByAccountId = async (name, accountType = 'epic', timeWindow = 'lifetime', image = 'none'): Promise<any> => {
    
    const apiKey = process.env.FORTNITE_API_KEY!;

    const url = `${FORTNITE_API_ENDPOINT}?name=${name}&accountType=${accountType}&timeWindow=${timeWindow}&image=${image}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': process.env.FORTNITE_API_KEY!
        }
    });
    if (response.status !== 200) {
        console.log('Error:', response.statusText);
        return null;
    }
    
    const json = await response.json();
    return json;    
};
const accountId = "Duality";
const language = "en";
console.log(await getFortniteShopData(language));