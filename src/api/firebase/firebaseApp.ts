import { FirebaseOptions, initializeApp } from 'firebase/app';
import { config } from 'dotenv';
import Pino from '../../logger.js';
config();

const apiKey = process.env.FIREBASE_OAUTH_API_KEY;
if (!apiKey) Pino.error('FIREBASE_OAUTH_API_KEY not set, Google login will not work.');

const firebaseConfig: FirebaseOptions = {
	projectId: 'yourstats-24dea',
	apiKey
};

export const initFirebase = () => {
	const app = initializeApp(firebaseConfig);
	app.automaticDataCollectionEnabled = false;
};

export default initFirebase;