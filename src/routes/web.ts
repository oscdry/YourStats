import { Router, type Response, type Request } from "express";

const webRouter = Router();


webRouter.get("/", (_req: Request, res: Response) => {
    res.render('index', { title: "Homepage" });
});

webRouter.get("/admin", (_req: Request, res: Response) => {
    res.render('./backoffice/dashboard.ejs', { title: "Admin Panel" });
});

webRouter.get("/about", (_req: Request, res: Response) => {
    res.render('./about.ejs', { title: "Contacto" });
});
export default webRouter;