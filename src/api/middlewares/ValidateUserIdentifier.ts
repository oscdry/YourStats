import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';
import { getUserSchema } from "./schemas.js";

export const validateUserIdentifier = (req: Request, res: Response, next: NextFunction) => {
    Pino.info("validateUserIdentifier " + JSON.stringify(req.params));
    const { error } = getUserSchema.validate(req.params);

    if (error)
        throw new Error(error.details[0].message);

    next();
};