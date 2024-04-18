import { config } from 'dotenv';
import initFirebase from './api/firebase/firebaseApp.js';
initFirebase();
config();

import fs from 'fs';
import http, { type Server as HTTPServer } from 'http';
import https, { type Server as HTTPSServer } from 'https';
import express from 'express';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import Pino from './logger.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// import { Client, LegacyClient, Auth } from 'osu-web.js';
// Client for the current API (API v2)
// const client = new Client('eUPnOYKsnu4dBD6BJzjtsrtFpf91r7LFK7MTkbAa');

import adminRouter from './routes/adminRouter.js';
import apiRouter from './routes/api.js';
import webRouter from './routes/web.js';
import { errorHandler } from './api/middlewares/errorHandler.js';

const app = express();

app.disable('x-powered-by');

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

// HTTPS / HTTP
// Checks if the server is running in HTTPS mode
// In order to load the certificate and keys

let server: HTTPServer | HTTPSServer;
let port: number = 80;

// HTTPS Server setup / HTTP if not available
try {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	// TLS Support
	const key = fs.readFileSync(
		path.resolve(__dirname, '../certs/privkey.pem'), 'utf8');
	const cert = fs.readFileSync(
		path.resolve(__dirname, '../certs/cert.pem'), 'utf8');

	server = https.createServer(
		{
			key: key,
			cert: cert
		},
		app);

	port = 443;
	Pino.info('RUNNING IN HTTPS MODE OK');
} catch (error) {
	server = http.createServer(app);
	Pino.warn('RUNNING IN HTTP UNSAFE MODE, reason: ' + error);
}

app.use('/api', apiRouter);
app.use(webRouter);
app.use('/admin', adminRouter);

app.use(errorHandler);

server.listen(port, () => Pino.info(`Server listening on port ${port}`));

export default app;