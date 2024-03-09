import { type Request, type Response } from 'express';
import firestore from '../db/firebaseConnections.js';
import { generateTokenForUserId } from './tokenController.js';

import { createFirebaseUser, deleteFirebaseUserById, deleteFirebaseUserByMail, getFirebaseUserById, getFirebaseUserByMail, getFirebaseUserByUsername, updateFirebaseUserById, getAllFirebaseUsers} from "../services/FirebaseServices.js";
import { RegisterError } from '../errors/errors.js';
import { UserNotFoundError } from '../errors/errors.js';
import Pino from "../../logger.js";

export async function createUser(req: Request, res: Response) {
    const { username, mail, password } = req.body;

    Pino.info("UserController Creating User", { username, mail, password });

    try {
        const user = await getUserByIdentifier(username, 'username');
        if (user)
            throw new UserNotFoundError();

        const createUser = await createFirebaseUser(username, mail, password, '', 0);
        if (!createUser)
            throw new UserNotFoundError();

        const token = generateTokenForUserId({ id: createUser.id, username: createUser.username, role: createUser.role });
        return res.json({ token });
    } catch (error) {
        const message = (error as Error).message;
        throw new Error('An error occurred while creating the user' + message);
    };
};

// Main function to get user by identifier from Firebase Services
export async function getUserByIdentifier(identifier: string,
    type: 'email' | 'username' | 'id' = 'id'): Promise<FirebaseUser | null> {

    if (!identifier) {
        Pino.error('No identifier provided getting user by identifier');
        return null;
    }

    console.log('Getting user with identifier: ', identifier, ', type:', type);

    let user = null;

    switch (type) {
        case 'email':
            user = await getFirebaseUserByMail(identifier);
            break;
        case 'username':
            user = await getFirebaseUserByUsername(identifier);
            break;
        case 'id':
            user = await getFirebaseUserById(identifier);
            break;
        default:
            throw new Error('Invalid get user type:', type);
    }

    if (!user) {
        Pino.error('User not found getting user by identifier:' + identifier, ' + type:', type);
        return null;
    }

    return user;
};

export async function deleteUser(req: Request, res: Response) {
    const { identifier } = req.params;

    Pino.info("UserController Deleting User", { identifier });

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

    Pino.info("UserController Updating User", { identifier });

    const updates = {
        username: req.body.username,
        mail: req.body.mail,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        role: req.body.role,
        bio: req.body.bio
    };

    try {
        await updateFirebaseUserById(identifier, updates);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        const message = (error as Error).message;
        throw new Error('An error occurred while updating the user' + message);
    }
};

export const LogoutUser = (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.sendStatus(200);
};

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await getAllFirebaseUsers();
    res.json(users);
}

