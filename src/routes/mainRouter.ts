import { Request, Response, Router } from "express";
import { createUser, getUser, deleteUser, updateUser } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/createUsersMiddleware.js";
import { validateUserIdentifier } from "../api/middlewares/ValidateUserIdentifier.js";
import { validateUpdateUser } from "../api/middlewares/updateUserMiddleware.js";


const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);
mainRouter.get("/getUser/:identifier", validateUserIdentifier, getUser);
mainRouter.delete("/deleteUser/:identifier", validateUserIdentifier, deleteUser);
mainRouter.put("/updateUser/:identifier", validateUserIdentifier, validateUpdateUser, updateUser);




export default mainRouter;