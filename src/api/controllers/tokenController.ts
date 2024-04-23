import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from 'dotenv';
config();

import Pino from '../../logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('Error, No JWT_SECRET set');
}

export const generateTokenForUserId = (payload: TokenPayload): string => {
	Pino.debug('Generating token for user id: ' + payload.id);
	return jwt.sign(payload, JWT_SECRET!, { expiresIn: '1d' });
};
