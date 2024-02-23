import { type Request, type Response, type NextFunction } from 'express';
import firestore from '../db/firebaseConnections.js';
import Joi from 'joi';

export async function validateUpdateUser(req: Request, res: Response, next: NextFunction) {

  if (req.body.password_confirmation && !req.body.password) {
    return res.status(400).json({ error: 'Password confirmation provided without password' });
  }

  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    password_confirmation: Joi.string().when('password', {
      is: Joi.exist(),
      then: Joi.required().valid(Joi.ref('password')),
      otherwise: Joi.optional()
    }),
  }).min(1); // Asegura que al menos uno de los campos esté presente

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