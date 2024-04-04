import { type Request, type Response, type NextFunction } from 'express';
import { getUserByIdentifier } from '../controllers/userController.js';
import { UsernameUsedError } from '../errors/errors.js';
import { updateUsernameSchema } from './schemas.js';
// Si el username existe en la base de datos no deja ponerlo
export async function validateNameUserUpdate(req: Request, res: Response, next: NextFunction) {
  const { username } = req.body;

  if (username) {
    const user = await getUserByIdentifier(username, 'username');
    if (user) {
      next(new UsernameUsedError());
    }
  }

  // Execute check
  const { error } = updateUsernameSchema.validate(req.body);
  if (error)
    next(Error(error.details[0].message));
  next();
};