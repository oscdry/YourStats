import { Request, Response, Router } from "express";
import { createUser } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/usersMiddleware.js";

const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);


export default mainRouter;