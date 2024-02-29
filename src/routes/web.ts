import { Router, type Response, type Request } from "express";
import { getFirebaseUserById } from "../api/services/FirebaseServices.js";

const webRouter = Router();

const NotFoundPage = (_req: Request, res: Response) => {
    res.status(404).render('404.ejs', { title: "Page not found" });
};

webRouter.get("/", (_req: Request, res: Response) => {
    res.render('index', { title: "Homepage" });
});

webRouter.get("/user/:id", async (_req: Request, res: Response) => {
    const user = await getFirebaseUserById(_req.params.id);
    if (!user) return NotFoundPage(_req, res);

    res.render('./user.ejs', { title: "User", userView: user });
});

webRouter.get("/admin", (_req: Request, res: Response) => {
    res.render('./backoffice/dashboard.ejs', { title: "Admin Panel" });
});

webRouter.get("/about", (_req: Request, res: Response) => {
    res.render('./about.ejs', { title: "Contacto" });
});
export default webRouter;