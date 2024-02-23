import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateDeleteUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        identifier: Joi.string().required(), // Asegura que el identificador sea un string requerido
    });

    const { error } = schema.validate(req.params);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};