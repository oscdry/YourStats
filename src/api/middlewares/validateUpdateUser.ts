import { type Request, type Response, type NextFunction } from 'express';
import { getFirebaseUserByUsername } from "../services/FirebaseServices.js";
import { passwordRegex, updateUserSchema } from "./schemas.js";

export async function validateUpdateUser(req: Request, res: Response, next: NextFunction) {

  if (req.body.password_confirmation && !req.body.password)
    throw new Error('Password must be present if password confirmation is present');

  if (!passwordRegex.test(req.body.password))
    throw new Error('Password must have at least 8 characters, including one uppercase letter, one lowercase letter, and one number');

  const { mail } = req.body;
  const userExists = await getFirebaseUserByUsername(mail);

  if (userExists)
    throw new Error('Mail already used to create a user');

  // Execute check
  const { error } = updateUserSchema.validate(req.body);
  if (error)
    throw new Error(error.details[0].message);
  next();
};