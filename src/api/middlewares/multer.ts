// user Image controller
import { type Request } from 'express';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Pino from '../../logger.js';
import { fileURLToPath } from 'url';
import { ImageFormatError } from '../errors/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configura multer para almacenar archivos en el directorio deseado
const storage = multer.diskStorage({
	destination: (req: Request, file: Express.Multer.File, cb) => {
		const dir = path.join(__dirname, '../../../public/img/storage/users/');

		// Crea el directorio si no existe
		if (!fs.existsSync(dir)) {
			Pino.warn('Creating directory:', dir);
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir);
	},
	filename: (req: Request, file: Express.Multer.File, cb) => {
		const userId = req.params['userId'];

		Pino.trace('UserId:' + userId);

		// Construye el nombre del archivo con el userId y la extensión original
		const fileName = userId + path.extname(file.originalname);
		Pino.trace('Filename:' + fileName);
		cb(null, fileName);
	}
});

// Filtra los archivos para asegurar que solo se suban imágenes
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
	if (file.mimetype.startsWith('image/') &&
		file.originalname.match(/\.(jpg)$/)) {
		cb(null, true);
	} else {
		cb(new ImageFormatError(), false);
	}
};
export const upload = multer({ storage, fileFilter });


