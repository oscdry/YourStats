import { Request, Response, Router } from "express";
import { createUser } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/usersMiddleware.js";
import { validateGetUser } from "../api/middlewares/getUserMiddleware.js";
import { getUser } from "../api/controllers/userController.js";
import { deleteUser } from "../api/controllers/userController.js";
import { validateDeleteUser } from "../api/middlewares/deleteUserMiddleware.js";

const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);
mainRouter.get("/getUser/:identifier", validateGetUser, getUser);
mainRouter.delete("/deleteUser/:identifier", validateDeleteUser, deleteUser);




export default mainRouter;