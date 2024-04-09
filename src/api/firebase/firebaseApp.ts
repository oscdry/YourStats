import { FirebaseOptions, initializeApp } from 'firebase/app';
import { config } from 'dotenv';
config();

const firebaseConfig: FirebaseOptions = {
	projectId: 'yourstats-24dea',
	apiKey: process.env.FIREBASE_OAUTH_API_KEY
};

export const initFirebase = () => {
	const app = initializeApp(firebaseConfig);
	app.automaticDataCollectionEnabled = false;
};

export default initFirebase;