import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

async function extractSkinInfoFromPage(pageNumber: number) {
    try {
        const url = `https://www.mobafire.com/league-of-legends/skins?page=${pageNumber}`;

        const response = await axios.get(url);

        const $ = cheerio.load(response.data);

        const skinsInfo = [];

        $('.champ-skins__item').each((index, element) => {
            const skin = {};

            const skinName = $(element).find('h3').text().trim();
            const releaseDate = $(element).find('.date .localized-datetime').attr('title');
            const wishlistStatus = $(element).find('.wishlist-btn').text().trim();
            const popularity = $(element).find('.heart__val').text().trim();
            const cost = $(element).find('.champ-skins__item__cost').text().trim();
            const imageURL = $(element).find('img').eq(0).attr('data-original'); // Obtener la URL de la imagen

            skin['name'] = skinName;
            skin['releaseDate'] = releaseDate;
            skin['wishlistStatus'] = wishlistStatus;
            skin['popularity'] = popularity;
            skin['cost'] = cost;
            skin['imageURL'] = imageURL;

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
    
    console.log('Información de todas las skins extraída y guardada correctamente.');
}




function searchSkinByName(skinName: string) {
    try {
        const jsonData = fs.readFileSync('all_skins_info.json', 'utf8');
        const skinsInfo = JSON.parse(jsonData);

        const foundSkins = skinsInfo.filter((skin: { name: string }) =>
            skin.name.toLowerCase().includes(skinName.toLowerCase())
        );

        if (foundSkins.length > 0) {
            console.log(`Skins con "${skinName}":`);
            foundSkins.forEach((foundSkin: any) => {
                console.log(foundSkin);
            });
        } else {
            console.log(`No se encontraron skins que contengan "${skinName}".`);
        }
    } catch (error) {
        console.error('Error al buscar las skins:', error);
    }
}

//function getSkins

const totalPages = 42;

//extractSkinInfoFromAllPages(totalPages);

console.log(searchSkinByName("Akali"));
