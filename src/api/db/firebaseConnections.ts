import { Firestore } from '@google-cloud/firestore';

// Create a new client
const firestore = new Firestore({
  projectId: 'yourstats-24dea',
  keyFilename: 'yourstats-24dea-firebase-adminsdk-wlko5-606a53a876.json',
});

export default firestore;