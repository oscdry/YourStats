import { Router, type Response, type Request, NextFunction } from "express";
import { getFirebaseUserById } from "../api/services/FirebaseServices.js";
import { GetLolUserData } from "../calls.js";

import { getAllFirebaseUsers } from "../api/services/FirebaseServices.js";

import { errorHandler } from "../api/middlewares/errorHandler.js";
import { UserNotFoundError } from "../api/errors/errors.js";
import { verifyTokenOptional } from "../api/middlewares/verifyToken.js";

const webRouter = Router();

const NotFoundPage = (_req: Request, res: Response) => {
    res.status(404).render('404.ejs', { title: "Page not found" });
};

webRouter.use(verifyTokenOptional);


webRouter.get("/", (_req: Request, res: Response) => {
    res.render('index', { title: "Homepage" });
});

webRouter.get("/user/:id", async (_req: Request, res: Response) => {
    const user = await getFirebaseUserById(_req.params.id);
    if (!user) return NotFoundPage(_req, res);

    res.render('./user.ejs', { title: "User", userView: user });
});

webRouter.get("/admin", async (_req: Request, res: Response) => {
    const users = await getAllFirebaseUsers();
    res.render('./backoffice/dashboard.ejs', { title: "Admin Panel", users });
});

webRouter.get("/about", (_req: Request, res: Response) => {
    res.render('./about.ejs', { title: "Contacto" });
});

// League of Legends
webRouter.get("/lol", (_req: Request, res: Response) => {
    res.render('./lol/index.ejs', { title: "LoL" });
});

webRouter.get("/lol/stats/:gamename", async (_req: Request, res: Response, next: NextFunction) => {
    try {

        const loldata = await GetLolUserData(_req.params.gamename);
        if (!loldata) throw new UserNotFoundError();

        console.log("rendering " + loldata.gameName + " stats " + loldata.gamesLast7Days);

        return res.render('./lol/lol-user-stats.ejs', { title: "LoL Stats", loldata });

    } catch (error) {
        console.log("Error getting stats", error.name, error.message);

        next(error);
    }
});

webRouter.use(errorHandler);

export default webRouter;