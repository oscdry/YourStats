import { Request, Response, Router } from "express";

const mainRouter = Router();

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});


export default mainRouter;