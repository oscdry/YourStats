import { type Request, type Response } from 'express';
import firestore from '../db/firebaseConnections.js';

export async function createUser(req: Request, res: Response) {
    const { name, mail, password } = req.body;
    try {
        // Add the user to the Firestore database
        const newUserRef = await firestore.collection('users').add({
            name,
            mail,
            password,
        });
        res.status(201).send({ msg: "Usuario creado correctamente", userId: newUserRef.id });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ error: 'There was an error creating the user', details: message });
    };
}

export async function getUser(req: Request, res: Response) {
    const { identifier } = req.params; // Ahora se usa "identifier"

    try {
        // Determinar si el identificador es un mail
        if (identifier.includes('@')) {
            // Buscar usuario por mail
            const querySnapshot = await firestore.collection('users').where('mail', '==', identifier).get();
            if (querySnapshot.empty) {
                return res.status(404).json({ error: 'User not found' });
            }
            const userData = querySnapshot.docs[0].data();
            return res.status(200).json(userData);
        } else {
            // Buscar usuario por ID
            const doc = await firestore.collection('users').doc(identifier).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(doc.data());
        }
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ error: 'An error occurred while fetching the user', details: message });
    }
};

export async function deleteUser(req: Request, res: Response) {
    const { identifier } = req.params;

    try {
        if (identifier.includes('@')) {
            // Eliminar usuario por mail
            const querySnapshot = await firestore.collection('users').where('mail', '==', identifier).get();
            if (querySnapshot.empty) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Suponiendo que el mail es único y solo hay un documento que coincida
            const userId = querySnapshot.docs[0].id;
            await firestore.collection('users').doc(userId).delete();
            return res.status(200).json({ msg: "User deleted successfully" });
        } else {
            // Eliminar usuario por ID
            const doc = await firestore.collection('users').doc(identifier).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }

            await firestore.collection('users').doc(identifier).delete();
            return res.status(200).json({ msg: "User deleted successfully" });
        }
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ error: 'An error occurred while deleting the user', details: message });
    }
};

export async function updateUser(req: Request, res: Response) {
    const { identifier } = req.params;
    const updates = {
        name: req.body.name,
        mail: req.body.mail,
        password: req.body.password,
    };

    try {
        if (identifier.includes('@')) {
            // Actualizar usuario por email
            const querySnapshot = await firestore.collection('users').where('email', '==', identifier).get();
            if (querySnapshot.empty) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Actualizar el primer usuario que coincida (email debería ser único)
            const userId = querySnapshot.docs[0].id;
            await firestore.collection('users').doc(userId).update(updates);
            return res.status(200).json({ msg: "User updated successfully" });
        } else {
            // Actualizar usuario por ID
            const doc = await firestore.collection('users').doc(identifier).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }

            await firestore.collection('users').doc(identifier).update(updates);
            return res.status(200).json({ msg: "User updated successfully" });
        }
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ error: 'An error occurred while updating the user', details: message });
    }
};
