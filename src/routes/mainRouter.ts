import { Request, Response, Router } from "express";
import { createUser, getUserByIdentifier, deleteUser, updateUser, LogoutUser, getAllUsers } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/validateCreateUsers.js";
import { validateUpdateUser } from "../api/middlewares/validateUpdateUser.js";
import { LoginUser } from "../api/controllers/loginController.js";
import { validateUserIdentifier } from "../api/middlewares/validateUserIdentifier.js";
import { errorHandler } from "../api/middlewares/errorHandler.js";


const mainRouter = Router();

mainRouter.post("/login", LoginUser);
mainRouter.post("/logout", LogoutUser);
mainRouter.post("/register", validateCreateUser, createUser);

mainRouter.delete("/deleteUser/:identifier", validateUserIdentifier, deleteUser);
mainRouter.put("/updateUser/:identifier", validateUserIdentifier, validateUpdateUser, updateUser);
mainRouter.get("/getUser/:identifier", validateUserIdentifier, (req) => {
  const user = getUserByIdentifier(req.params.identifier, 'id');
  return user;
});
mainRouter.get("/getAllUsers", getAllUsers);

mainRouter.get("/users/search/:identifier", validateUserIdentifier, (req) => {
  const user = getUserByIdentifier(req.params.identifier, 'email');
  return user;
});



export default mainRouter;