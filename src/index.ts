import { config } from 'dotenv';
import initFirebase from './api/firebase/firebaseApp.js';
initFirebase();
config();

import path from 'path';
import { fileURLToPath } from 'url';
import express, { NextFunction, Response } from 'express';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import Pino from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// import { Client, LegacyClient, Auth } from 'osu-web.js';
// Client for the current API (API v2)
// const client = new Client('eUPnOYKsnu4dBD6BJzjtsrtFpf91r7LFK7MTkbAa');

import adminRouter from './routes/adminRouter.js';
import apiRouter from './routes/api.js';
import webRouter from './routes/web.js';
import { errorHandler } from './api/middlewares/errorHandler.js';

const app = express();

// Logging of requests
app.use((req, _res, next) => {
	Pino.debug(req.method + ' ' + req.url);
	next();
});

Pino.info('Starting server...');

app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);

// server.get('/hola', async (req: Request, res: Response): Promise<void> => {
//     res.sendStatus(200);
// });

// server.use(() => console.log('hola'));

// console.log("RiotAcc:");
// await RiotPUUIDByTagName("OSCDRY", "Jonan");

// console.log("RiotCall:");
// await RiotCallExample();

// // API v2
// let v2User = await client.users.getUser(16615204, {
//     urlParams: {
//         mode: 'osu'
//     }
// });
// console.log(v2User.id);

// const cs2 = await Cs2CallExample("76561198161126716");

// console.log(JSON.stringify(cs2));

app.use('/api', apiRouter);
app.use(webRouter);
app.use('/admin', adminRouter);

app.use(errorHandler);

const port = 8080;
app.listen(port, () => Pino.info(`Server listening on port ${port}`));

export default app;