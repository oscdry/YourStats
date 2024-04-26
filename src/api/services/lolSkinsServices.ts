import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import Pino from '../../logger.js';

interface SkinInfo {
	name: string;
	releaseDate: string;
	wishlistStatus: string;
	popularity: string;
	cost: string;
	imageURL: string;
	landscapeURL: string;
	chromaURL: string;
}

async function extractSkinInfoFromPage(pageNumber: number) {
	try {
		const url = `https://www.mobafire.com/league-of-legends/skins?page=${pageNumber}`;

		const response = await axios.get(url);
		const $ = cheerio.load(response.data);
		const skinsInfo: SkinInfo[] = [];

		$('.champ-skins__item').each((index, element) => {

			const skinName = $(element).find('h3').text().trim();
			const releaseDate = $(element).find('.date .localized-datetime').attr('title');
			const wishlistStatus = $(element).find('.wishlist-btn').text().trim();
			const popularity = $(element).find('.heart__val').text().trim();
			const cost = $(element).find('.champ-skins__item__cost').text().trim();
			const imageURL = 'https://www.mobafire.com' + $(element).find('img').eq(0).attr('data-original');

			const skin: SkinInfo = {} as SkinInfo;

			skin['name'] = skinName;
			skin['releaseDate'] = releaseDate ? releaseDate : 'Unknown';
			skin['wishlistStatus'] = wishlistStatus;
			skin['popularity'] = popularity;
			skin['cost'] = cost;
			skin['imageURL'] = imageURL;
			const landscapeURL = imageURL.replace('/portrait/', '/landscape/');
			const chromaURL = imageURL.replace('/portrait/', '/chromas/');
			skin['landscapeURL'] = landscapeURL;
			skin['chromaURL'] = chromaURL;

			skinsInfo.push(skin);
		});

		return skinsInfo;

	} catch (error) {
		console.error('Error:', error);
		return []; // Retorna un array vacío en caso de error
	}
}

async function extractSkinInfoFromAllPages(totalPages: number) {
	const allSkinsInfo = [];

	for (let page = 1; page <= totalPages; page++) {
		const skinsInfoFromPage = await extractSkinInfoFromPage(page);
		allSkinsInfo.push(...skinsInfoFromPage);
	}

	fs.writeFileSync('all_skins_info.json', JSON.stringify(allSkinsInfo, null, 2));
	Pino.info('Información de todas las skins extraída y guardada correctamente.');
}

export function searchSkinByName(skinName: string) {
	try {
		const jsonData = fs.readFileSync('all_skins_info.json', 'utf8');
		const skinsInfo = JSON.parse(jsonData);
		const foundSkins = skinsInfo.filter((skin: { name: string; }) =>
			skin.name.toLowerCase().includes(skinName.toLowerCase())
		);

		if (foundSkins.length > 0) {
			return foundSkins;
		} else {
			return '';
		}
	} catch (error) {
		console.error('Error al buscar las skins:', error);
		return '';
	}
}

export function getNewSkins() {
	try {
		const jsonData = fs.readFileSync('all_skins_info.json', 'utf8');
		const skinsInfo = JSON.parse(jsonData);
		const firstFiveSkins = skinsInfo.slice(0, 5);
		return firstFiveSkins;

	} catch (error) {
		console.error('Error al obtener las skins:', error);
		return '';
	}
}

const totalPages = 42;

//extractSkinInfoFromAllPages(totalPages);
//console.log(getNewSkins());
//console.log(searchSkinByName("Akali"));
