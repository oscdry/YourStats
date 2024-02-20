import { Request, Response, Router } from "express";
import { createUser } from "../api/controllers/userController";
import { validateCreateUser } from "../api/middlewares/usersMiddleware";

const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);


export default mainRouter;