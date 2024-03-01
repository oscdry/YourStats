import firestore from "../db/firebaseConnections.js";
import { hash } from "bcrypt";

export const getFirebaseUserById = async (id: string): Promise<FirebaseUser | null> => {
    if (!id) {
        console.error('No user ID provided getting by ID');
        return null;
    };

    const userRef = await firestore.collection('users').doc(id).get();
    if (!userRef.exists) {
        console.error('User not found getting by ID');
        return null;
    };
    return buildFirebaseUser(userRef);
};

export const getFirebaseUserByMail = async (mail: string): Promise<FirebaseUser | null> => {
    if (!mail) {
        console.error('No mail provided getting by mail');
        return null;
    };

    const userRef = await firestore.collection('users').where('mail', '==', mail).get();
    if (userRef.empty) {
        console.error('Users not found getting by mail');
        return null;
    };
    return buildFirebaseUser(userRef.docs[0]);
};

export const getFirebaseUserByUsername = async (username: string): Promise<FirebaseUser | null> => {
    if (!username) {
        console.error('No mail provided getting by username');
        return null;
    };

    const userRef = await firestore.collection('users').where('username', '==', username).get();
    if (userRef.empty) {
        console.error('Users not found getting by username');
        return null;
    };
    return buildFirebaseUser(userRef.docs[0]);
};

export const deleteFirebaseUserById = async (id: string): Promise<boolean> => {
    if (!id) {
        console.error('No user ID provided deleting by ID');
        return false;
    };

    await firestore.collection('users').doc(id).delete();
    return true;
};

export const deleteFirebaseUserByMail = async (mail: string): Promise<boolean> => {
    if (!mail) {
        console.error('No mail provided deleting by mail');
        return false;
    };

    const userRef = await firestore.collection('users').where('mail', '==', mail).get();
    if (userRef.empty) {
        console.error('Users not found deleting by mail');
        return false;
    };

    await firestore.collection('users')
        .doc(userRef.docs[0].id).delete();
    return true;
};

export const createFirebaseUser = async (username: string, mail: string, password: string, bio: string, role: number): Promise<FirebaseUser | null> => {
    if (!mail) {
        console.error('No mail provided creating user');
        return null;
    };

    const userRef = await firestore.collection('users').add({
        username,
        mail,
        hash: await hash(password, 10),
        bio,
        role,
    
    });
    return buildFirebaseUser(await userRef.get());
};

const buildFirebaseUser = (querySnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): FirebaseUser => {
    const doc = querySnapshot.data();
    return {
        id: querySnapshot.id,
        username: doc!.username,
        mail: doc!.mail,
        bio: doc!.bio,
        hash: doc!.hash,
        role: doc!.role,
    };
};
