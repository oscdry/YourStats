import firestore from '../db/firebaseConnections.js';
import { hash } from 'bcrypt';
import { UserNotFoundError } from '../errors/errors.js';
import Pino from '../../logger.js';
import { FirebaseUser } from '../types/FirebaseUser.js';
import { getUserByIdentifier } from '../controllers/userController.js';

/**
 * Converts a Firestore DocumentSnapshot to a FirebaseUser object
 * @param querySnapshot Firestore DocumentSnapshot
 * @returns FirebaseUser object
 */
const buildFirebaseUser = (querySnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): FirebaseUser => {
	const doc = querySnapshot.data();
	return {
		id: querySnapshot.id,
		username: doc!.username,
		mail: doc!.mail,
		bio: doc!.bio,
		hash: doc!.hash,
		role: doc!.role,
		google: doc!.google,
		resetPasswordToken: doc!.token,
		resetPasswordExpires: doc!.expires
	};
};

export const getFirebaseUserById = async (id: string): Promise<FirebaseUser | null> => {
	if (!id) {
		console.error('No user ID provided getting by ID');
		return null;
	}

	const userRef = await firestore.collection('users').doc(id).get();
	if (!userRef.exists) {
		Pino.error('User not found getting by ID');
		return null;
	}
	return buildFirebaseUser(userRef);
};

export const getFirebaseUserByMail = async (mail: string): Promise<FirebaseUser | null> => {
	if (!mail) {
		console.error('No mail provided getting by mail');
		return null;
	}

	const userRef = await firestore.collection('users').where('mail', '==', mail).get();
	if (userRef.empty) {
		Pino.error('FB Service Users not found getting by mail');
		return null;
	}
	return buildFirebaseUser(userRef.docs[0]);
};

export const getFirebaseUserByResetPasswordToken = async (token: string): Promise<FirebaseUser | null> => {
	if (!token) {
		Pino.error('No token provided getting by reset password token');
		return null;
	}

	const userRef = await firestore.collection('users').where('resetPasswordToken', '==', token).get();
	if (userRef.empty) {
		Pino.error('Users not found getting by reset password token');
		return null;
	}

	return buildFirebaseUser(userRef.docs[0]);
};

export const clearResetPasswordToken = async (id: string): Promise<void> => {
	if (!id) {
		Pino.error('No user ID provided clearing reset password token');
		return;
	}

	await firestore.collection('users').doc(id).update({
		resetPasswordToken: null,
		resetPasswordExpires: null
	});
};

export const getFirebaseUserByUsername = async (username: string): Promise<FirebaseUser | null> => {
	if (!username) {
		Pino.error('No mail provided getting by username');
		return null;
	}

	Pino.debug('getting by username: ' + username);

	const userRef = await firestore.collection('users').where('username', '==', username).get();
	if (userRef.empty) {
		Pino.warn('Users not found getting by username: ' + username);
		return null;
	}

	return buildFirebaseUser(userRef.docs[0]);
};

export const deleteFirebaseUserById = async (id: string): Promise<boolean> => {
	if (!id) {
		console.error('No user ID provided deleting by ID');
		return false;
	}

	await firestore.collection('users').doc(id).delete();
	return true;
};

export const deleteFirebaseUserByMail = async (mail: string): Promise<boolean> => {
	if (!mail) {
		Pino.error('No mail provided deleting by mail');
		return false;
	}

	const userRef = await firestore.collection('users').where('mail', '==', mail).get();
	if (userRef.empty) {
		Pino.error('Users not found deleting by mail');
		return false;
	}

	await firestore.collection('users')
		.doc(userRef.docs[0].id).delete();
	return true;
};

export const createFirebaseUser = async (username: string, mail: string, password: string, bio: string, role: number, google: boolean = false): Promise<FirebaseUser | null> => {
	if (!mail) {
		console.error('No mail provided creating user');
		return null;
	}

	const userRef = await firestore.collection('users').add({
		username,
		mail,
		hash: await hash(password, 10),
		bio,
		role,
		google: google ? 1 : 0
	});
	return buildFirebaseUser(await userRef.get());
};


export const userExists = async (username: string | null, mail: string | null) => {

	const [user, userMail] = await Promise.all(
		[username ? getUserByIdentifier(username, 'username') : null
			, mail ? getUserByIdentifier(mail, 'email') : null]);

	return [user, userMail];
};

export const updateUserPassword = async (user: FirebaseUser, password: string) => {
	return firestore.collection('users').doc(user.id).update({
		hash: await hash(password, 10)
	});
};

export const userExistsByMail = async (mail: string) => {
	return await getUserByIdentifier(mail, 'email');
};

export const getAllFirebaseUsers = async (): Promise<FirebaseUser[]> => {
	const usersRef = await firestore.collection('users').get();
	return usersRef.docs.map(buildFirebaseUser);
};

// metodo para obtener usuarios de firebase de 10 en 10
export const getFirebaseUsersByPage = async (page: number): Promise<{ users: FirebaseUser[], count: number; }> => {
	const usersRef = await firestore.collection('users').orderBy('username').limit(10).offset((page - 1) * 10).get();
	const count = await firestore.collection('users').count().get();
	const users = usersRef.docs.map(buildFirebaseUser);
	return { users, count: count.data().count };
};

export const updateFirebaseUserById = async (id: string, updates: { username?: string; mail?: string; password?: string; role?: number; bio?: string; }): Promise<void> => {
	if (!id) {
		throw new UserNotFoundError();
	}

	const doc = await firestore.collection('users').doc(id).get();
	if (!doc.exists) {
		throw new UserNotFoundError();
	}

	// Extrae password de los updates y guarda el resto en updatesWithoutPassword
	const { password, ...updatesWithoutPassword } = updates;

	// Solo calcula hashPassword si password no es nulo, indefinido o una cadena vacía
	const hashPassword = password && password.trim() ? await hash(password, 10) : undefined;

	// Prepara los datos a actualizar, excluyendo el hashPassword si no debe cambiar
	const updateData = {
		...updatesWithoutPassword,
		...(hashPassword && { hash: hashPassword }) // Añade hash solo si hashPassword ha sido calculado
	};

	// Actualiza en Firestore
	await firestore.collection('users').doc(id).update(updateData);
};

export const updateFirebaseUserName = async (id: string, updates: { username?: string; }): Promise<void> => {
	if (updates.username) {
		await firestore.collection('users').doc(id).update({
			username: updates.username
		});
	}
	await firestore.collection('users').doc(id).update(updates);
};

export const updateFirebaseUserBio = async (id: string, updates: { bio?: string; }): Promise<void> => {
	if (updates.bio) {
		await firestore.collection('users').doc(id).update({
			bio: updates.bio
		});
	}
	await firestore.collection('users').doc(id).update(updates);
};
export const searchByEmailBackoffice = async (mail: string): Promise<FirebaseUser[]> => {
	const usersRef = await firestore
		.collection('users')
		.where('mail', '>=', mail)
		.where('mail', '<=', mail + '\uf8ff')
		.get();
	return usersRef.docs.map(buildFirebaseUser);
};