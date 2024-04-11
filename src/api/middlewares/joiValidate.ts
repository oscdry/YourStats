import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import Pino from '../../logger.js';

export const joiValidate = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (error) {
		if (error instanceof Error)
			Pino.warn('middelware JoiValidate error: ', error.message);

		Pino.warn('middelware JoiValidate error: ', error);
		next(error);
	}
};