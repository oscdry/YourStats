import { type Request, type Response, type NextFunction } from 'express';
import firestore from '../db/firebaseConnections.js';
import Joi from 'joi';

// Validate the method for create users
export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    mail: Joi.string().email().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.required().valid(Joi.ref('password')),
  });

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).json({ error: 'Password must have at least 8 characters, including one uppercase letter, one lowercase letter, and one number' });
  }

  const { mail } = req.body;
  const userExists = await firestore.collection('users').where('mail', '==', mail).get();
  if (!userExists.empty) {
    return res.status(400).json({ error: 'Mail already used to create a user' });
  }

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};