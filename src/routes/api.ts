import { Request, Response, Router } from "express";
import { createUser, getUserByIdentifier, deleteUser, updateUser, LogoutUser, getAllUsers, updateUserName } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/validateCreateUsers.js";
import { validateUpdateUser } from "../api/middlewares/validateUpdateUser.js";
import { validateNameUserUpdate } from "../api/middlewares/validateNameUserUpdate.js";
import { LoginUser } from "../api/controllers/loginController.js";
import { validateUserIdentifier } from "../api/middlewares/validateUserIdentifier.js";
import { errorHandler } from "../api/middlewares/errorHandler.js";
import { GetLolUserData } from "../api/services/lolServices.js";
import { updateFirebaseUserById, updateFirebaseUserName } from "../api/services/FirebaseServices.js";
import { verifyTokenOptional } from "../api/middlewares/verifyToken.js";
import Pino from "../logger.js";


const mainRouter = Router();

mainRouter.post("/login", LoginUser);
mainRouter.post("/logout", LogoutUser);
mainRouter.post("/register", validateCreateUser, createUser);

mainRouter.delete("/deleteUser/:identifier", validateUserIdentifier, deleteUser);
mainRouter.put("/update-user/:identifier", validateUserIdentifier, validateUpdateUser, updateUser);
mainRouter.get("/get-user/:identifier", validateUserIdentifier, async (req, res, next) => {
  const user = await getUserByIdentifier(req.params.identifier, 'username');
  Pino.trace(JSON.stringify(user));
  return res.json(user);
});
mainRouter.get("/get-all-users", getAllUsers);
mainRouter.get("/lol-data/:username", async (req, res) => {
  const userName = req.params.username;
  return res.json(await GetLolUserData(userName));
});

mainRouter.get("/users/search/:identifier", validateUserIdentifier, (req) => {
  const user = getUserByIdentifier(req.params.identifier, 'email');
  return user;
});
mainRouter.use(verifyTokenOptional);

mainRouter.put("/update-user-username/:identifier", validateUserIdentifier, validateNameUserUpdate, updateUserName);


export default mainRouter;