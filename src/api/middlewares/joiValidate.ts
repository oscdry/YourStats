import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import Pino from '../../logger.js';

export const joiValidate = (schema: ObjectSchema, target: 'body' | 'headers' | 'params' | 'query') => async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { error } = schema.validate(req[target]);
		if (error)
			throw error;

		Pino.trace('middleware of' + schema._flags.name + ' JoiValidate success');

		next();
	} catch (error) {
		if (error instanceof Error)
			Pino.warn('middleware JoiValidate error: ' + error.message);

		Pino.warn('middleware JoiValidate error: ' + error);
		next(error);
	}
};