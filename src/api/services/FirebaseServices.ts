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

export const getAllFirebaseUsers = async (): Promise<FirebaseUser[]> => {
    const usersRef = await firestore.collection('users').get();
    return usersRef.docs.map(buildFirebaseUser);
}

export const updateFirebaseUserById = async (id: string, updates: { username?: string; mail?: string; password?: string }): Promise<void> => {
    if (!id) {
        throw new Error('No user ID provided for updating');
    }

    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
        throw new Error('User not found updating by ID');
    }

    const hashPassword = updates.password ? await hash(updates.password, 10) : undefined;
    await firestore.collection('users').doc(id).update({
        ...updates,
        ...(hashPassword && { hash: hashPassword })
    });
};

export const updateFirebaseUserByMail = async (mail: string, updates: { username?: string; password?: string }): Promise<void> => {
    if (!mail) {
        throw new Error('No mail provided for updating');
    }

    const querySnapshot = await firestore.collection('users').where('mail', '==', mail).get();
    if (querySnapshot.empty) {
        throw new Error('User not found updating by mail');
    }

    const userId = querySnapshot.docs[0].id;
    const hashPassword = updates.password ? await hash(updates.password, 10) : undefined;
    await firestore.collection('users').doc(userId).update({
        ...updates,
        ...(hashPassword && { hash: hashPassword })
    });
};