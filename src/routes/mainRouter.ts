import { Request, Response, Router } from "express";
import { createUser } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/createUsersMiddleware.js";
import { validateUserIdentifier } from "../api/middlewares/ValidateUserIdentifier.js";
import { getUser } from "../api/controllers/userController.js";
import { deleteUser } from "../api/controllers/userController.js";

const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);
mainRouter.get("/getUser/:identifier", validateUserIdentifier, getUser);
mainRouter.delete("/deleteUser/:identifier", validateUserIdentifier, deleteUser);




export default mainRouter;