import { Router } from 'express';
import { deleteFirebaseUserById } from '../api/services/FirebaseServices.js';

const adminRouter = Router();

adminRouter.get("/users/delete/:id", async (_req, res) => {
  await deleteFirebaseUserById(_req.params.id);
  res.redirect('/admin');
});

export default adminRouter;