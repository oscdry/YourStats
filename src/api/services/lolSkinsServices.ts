import axios from 'axios';
import cheerio from 'cheerio';

interface Skin {
    uri: string;
    name: string;
    rp_price: number | null;
    imageUrl: string;
}

const baseURL = 'https://rankedkings.com/';


export async function getSkinsChamp(nombreCampeon: string): Promise<Skin[]> {
    try {
        const urlCampeon = `${baseURL}/${nombreCampeon}`;
        const response = await axios.get(urlCampeon);
        const scriptDataRegex = /<script id="vike_pageContext" type="application\/json">([^]+?)<\/script>/;
        const scriptDataMatch = response.data.match(scriptDataRegex);
        
        const skins: Skin[] = [];

        const $ = cheerio.load(response.data);
        const skinContainers = $('div.hover\\:cursor-pointer');

        skinContainers.each((index, element) => {
            const scriptData = JSON.parse(scriptDataMatch[1]);
            const skinsData = scriptData.pageProps.data.skins;
            const uri = $(element).find('a').attr('href') || '';
            const name = $(element).find('p.text-xs').text().trim();
            const rpPrice = parseInt(($(element).find('div.absolute').text().trim().split(' ')[0] || ''), 10) || null;
            const imageUrl = $(element).find('img').attr('src') || '';

            skins.push({ uri, name, rp_price: rpPrice, imageUrl });
        });
        console.log(skins);
        return skins;
    } catch (error) {
        console.error("Error obtainig champ info:", error);
        return [];
    }
}

export async function getAllSkins(url: string): Promise<Skin[]> {
    try {
        const response = await axios.get(url);
        const jsonData = getJSON(response.data);

        if (!jsonData) {
            throw new Error('Cannot find  JSON ');
        }

        const skinsData = jsonData.pageProps.data.skins;

        const skins: Skin[] = skinsData.map((skinData: any) => ({
            uri: skinData.uri,
            name: skinData.name,
            rp_price: skinData.rp_price,
            id: skinData.id,
            image_URL: `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${getChampId(skinData.id)}/${skinData.id}.jpg`
        }));

        return skins;
    } catch (error) {
        console.error("Error with skin INFO", error);
        return [];
    }
}

function getJSON(html: string): any {
    const inicio = html.indexOf('{"pageProps":{"data":{"skins":[');
    const fin = html.indexOf('</script>', inicio);

    if (inicio !== -1 && fin !== -1) {
        const jsonString = html.slice(inicio, fin);
        return JSON.parse(jsonString);
    }

    return null;
}

function getChampId(idSkin: number): number {
    const idCampeon = Math.floor(idSkin / 1000);
    return idCampeon;
}




async function getNewSkins(): Promise<Skin[]> {
    try {
        const response = await axios.get(baseURL);
        const jsonData = getJSON(response.data);

        if (!jsonData) {
            throw new Error('Cannot find  JSON Cannot find  JSON ');
        }

        const skinsData = jsonData.pageProps.data.skins.slice(0, 12);

        const skins: Skin[] = skinsData.map((skinData: any) => ({
            uri: skinData.uri,
            name: skinData.name,
            rp_price: skinData.rp_price,
            id: skinData.id,
            image_URL: `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${getChampId(skinData.id)}/${skinData.id}.jpg`
        }));

        return skins;
    } catch (error) {
        console.error("Error with skin INFO", error);
        return [];
    }
}


const nombreCampeon = 'gragas';
console.log(await getAllSkins(baseURL));