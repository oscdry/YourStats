import { Request, Response, Router } from "express";
import { createUser, getUserByIdentifier, deleteUser, updateUser } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/createUsersMiddleware.js";
import { validateUserIdentifier } from "../api/middlewares/ValidateUserIdentifier.js";
import { validateUpdateUser } from "../api/middlewares/updateUserMiddleware.js";
import { LoginUser } from "../api/controllers/loginController.js";


const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);
// mainRouter.get("/getUser/:identifier", validateUserIdentifier, getUserById);
mainRouter.delete("/deleteUser/:identifier", validateUserIdentifier, deleteUser);
mainRouter.put("/updateUser/:identifier", validateUserIdentifier, validateUpdateUser, updateUser);

mainRouter.post("/login", LoginUser);


export default mainRouter;