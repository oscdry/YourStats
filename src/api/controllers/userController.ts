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