import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import Pino from '../../logger.js';

export const JoiValidate = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (error) {
		Pino.warn('middelware JoiValidate error: ', error.message);
		next(error);
	}
};