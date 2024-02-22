import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';

export const validateGetUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        id: Joi.string().optional(),
        email: Joi.string().email().optional(),
    }).xor('id', 'email'); // .xor asegura que solo uno de los dos campos puede estar presente

    const { error } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};