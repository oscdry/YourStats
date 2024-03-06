import { type Request, type Response } from 'express';
import firestore from '../db/firebaseConnections.js';
import { generateTokenForUserId } from './tokenController.js';
import { createFirebaseUser, deleteFirebaseUserById, deleteFirebaseUserByMail, getFirebaseUserById, getFirebaseUserByMail, getFirebaseUserByUsername, updateFirebaseUserByMail, updateFirebaseUserById } from "../services/FirebaseServices.js";
import { RegisterError } from '../Errors/errors.js';

export async function createUser(req: Request, res: Response) {
    const { username, mail, password } = req.body;
    try {
        const user = await getUserByIdentifier(username, 'username', res);
        if (user)
            throw new RegisterError();

        const createUser = await createFirebaseUser(username, mail, password, '', 0);
        if (!createUser)
            throw new RegisterError();

        const token = generateTokenForUserId({ id: createUser.id });
        return res.json({ token });
    } catch (error) {
        const message = (error as Error).message;
        throw new Error('An error occurred while deleting the user' + message);
    };
}


export async function getUserByIdentifier(identifier: string,
    type: 'email' | 'username' | 'id' = 'id',
    res: Response): Promise<FirebaseUser | null> {

    console.log('getting user with identifier:', identifier, ', type:', type);


    switch (type) {
        case 'email':
            return await getFirebaseUserByMail(identifier);
        case 'username':
            return await getFirebaseUserByUsername(identifier);
        case 'id':
            return await getFirebaseUserById(identifier);
        default:
            throw new Error('Invalid get user type:', type);
    }
};

export async function deleteUser(req: Request, res: Response) {
    const { identifier } = req.params;

    try {
        if (identifier.includes('@')) {
            await deleteFirebaseUserByMail(identifier);
        } else {
            await deleteFirebaseUserById(identifier);
        }
    } catch (error) {
        const message = (error as Error).message;
        throw new Error('An error occurred while deleting the user' + message);
    }
};

export async function updateUser(req: Request, res: Response) {
    const { identifier } = req.params;
    const updates = {
        username: req.body.username,
        mail: req.body.mail,
        password: req.body.password,
    };

    try {
        if (identifier.includes('@')) {
            await updateFirebaseUserByMail(identifier, updates);
        } else {
            await updateFirebaseUserById(identifier, updates);
        }
        res.json({ message: "User updated successfully" });
    } catch (error) {
        const message = (error as Error).message;
        throw new Error('An error occurred while updating the user' + message);
    }
}
