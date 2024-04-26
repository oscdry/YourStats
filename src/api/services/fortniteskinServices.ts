import cheerio from 'cheerio';
import fs from 'fs';

async function fetchFortniteShopData() {
	try {
		const response = await fetch('https://fortnite.gg/shop?game=br');
		const html = await response.text();

		const $ = cheerio.load(html);

		const skins = [];

		$('.fn-item').each(function() {
			const name = $(this).find('.fn-item-name').text().trim();
			const imageRelative = $(this).find('.img').attr('src');
			const priceElement = $(this).find('.fn-item-price');
			const priceText = priceElement.text().trim();
			const price = parseInt(priceText.replace(/\D/g, ''), 10);
			const image = 'https://fortnite.gg' + imageRelative;
			const imageUrl = image;
			const idMatch = imageUrl.match(/\/items\/(\d+)/);
			const id = idMatch ? idMatch[1] : null;
			const filePath = '/img/fortnite/skins/' + id + '.jpg'; 
			skins.push({ name, image, price, filePath });
		});

		const skinsJSON = JSON.stringify(skins, null, 2);
		console.log(skinsJSON);

		fs.writeFileSync('skins.json', skinsJSON);
	} catch (error) {
		console.error('Ocurrió un error al obtener los datos:', error);
	}
}


export async function downloadImagesFromJSON(jsonFilePath, outputPath) {
	try {
		const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
		const skins = JSON.parse(jsonData);

		if (!fs.existsSync(outputPath)) {
			fs.mkdirSync(outputPath, { recursive: true });
		}

		await Promise.all(skins.map(async (skin, index) => {
			try {
				const response = await fetch(skin.image);
				const buffer = await response.arrayBuffer();
				const imageUrl = skin.image;
				const idMatch = imageUrl.match(/\/items\/(\d+)/);
				const id = idMatch ? idMatch[1] : null;
				const fileName = `${id}.jpg`; 
				const filePath = `${outputPath}${fileName}`;
				console.log(filePath);
				fs.writeFileSync(filePath, Buffer.from(buffer));

				//console.log(`Imagen ${index + 1} descargada y guardada como ${fileName}`);
			} catch (error) {

				//console.error(`Error al descargar la imagen ${index + 1}:`, error);
			}
		}));

		//console.log('Todas las imágenes han sido descargadas correctamente.');
	} catch (error) {

		//console.error('Ocurrió un error al procesar el archivo JSON:', error);
	}
}

const jsonFilePath = 'skins.json'; 
const outputPath = 'public/img/fortnite/skins/'; 

//downloadImagesFromJSON(jsonFilePath, outputPath);

console.log(await fetchFortniteShopData());