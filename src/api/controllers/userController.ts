import { type Request, type Response } from 'express';
import firestore from '../db/firebaseConnections.js';

export async function createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    try {
        // Add the user to the Firestore database
        const newUserRef = await firestore.collection('users').add({
            name,
            email,
            password,
        });
        res.status(201).send({ msg: "Usuario creado correctamente", userId: newUserRef.id });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ error: 'There was an error creating the user', details: message });
    };
}

export async function getUser(req: Request, res: Response) {
    const { id, email } = req.query; // Asume que los valores vienen como query params

    try {
        if (id) {
            // Buscar usuario por ID
            const doc = await firestore.collection('users').doc(String(id)).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(doc.data());
        } else if (email) {
            // Buscar usuario por email
            const querySnapshot = await firestore.collection('users').where('email', '==', email).get();
            if (querySnapshot.empty) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Suponiendo que el email es único, devuelve el primer resultado
            const userData = querySnapshot.docs[0].data();
            return res.status(200).json(userData);
        } else {
            // Si no se proporciona ni id ni email
            return res.status(400).json({ error: 'User ID or email must be provided' });
        }
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ error: 'An error occurred while fetching the user', details: message });
    }
};


