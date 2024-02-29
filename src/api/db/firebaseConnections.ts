import {Firestore} from '@google-cloud/firestore';

// Create a new client
const firestore = new Firestore({
  projectId: 'yourstats-24dea',
  keyFilename: 'yourstats-24dea-firebase-adminsdk-wlko5-606a53a876.json',
});

export default firestore;

/*async function quickstart() {
  // Obtain a document reference.
  const document = firestore.doc('users/S05SDbrkJMhzeaNwc4md');

  // Enter new data into the document.
  await document.set({
    title: 'Welcome to Firestore',
    body: 'Hello World',
  });
  console.log('Entered new data into the document');

  // Update an existing document.
  await document.update({
    body: 'My first Firestore app',
  });
  console.log('Updated an existing document');

  // Read the document.
  const doc = await document.get();
  console.log(doc);

  // Delete the document.
  await document.delete();
  console.log('Deleted the document');
}
await quickstart();*/