import { Router, type Response, type Request } from "express";

const webRouter = Router();


webRouter.get("/", (_req: Request, res: Response) => {
    res.render('index', { title: "Homepage" });
});

export default webRouter;