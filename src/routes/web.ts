import { Router, type Response, type Request, NextFunction } from "express";
import { getFirebaseUserById } from "../api/services/FirebaseServices.js";
import { GetLolUserData } from "../api/services/lolServices.js";

import { getAllFirebaseUsers } from "../api/services/FirebaseServices.js";

import { errorHandler } from "../api/middlewares/errorHandler.js";
import { UserNotFoundError } from "../api/errors/errors.js";
import { verifyTokenOptional } from "../api/middlewares/verifyToken.js";
import Pino from "../logger.js";
import { lolTestData } from "../api/services/lolTestData.js";

const webRouter = Router();

// Not found page
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

// Brawl Stars
webRouter.get("/brawl", (_req: Request, res: Response) => {
    res.render('./brawl/index.ejs', { title: "Brawl Stars" });
});

// League of Legends
webRouter.get("/lol", (_req: Request, res: Response) => {
    res.render('./lol/index.ejs', { title: "LoL" });
});

//! Testing routes
webRouter.get("/lol/stats/asd", async (_req: Request, res: Response, next: NextFunction) => {

    return res.render('./lol/lol-user-stats.ejs', { title: "LoL Stats", loldata: lolTestData });
});

webRouter.get("/lol/stats/chart", async (_req: Request, res: Response, next: NextFunction) => {

    let chartdata = {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Users',
                data: [50, 60, 70, 180]
            }, {
                label: 'Revenue',
                data: [100, 200, 300, 400]
            }]
        }
    };

    const dataPie = {
        type: 'pie',
        data: {
            labels: [
                'Red',
                'Blue',
                'Yellow'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    };

    const dataLine = {
        type: 'line',
        data: {
            labels: [
                'Red',
                'Blue',
                'Yellow'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    };

    const dataDonut = {
        type: 'doughnut',
        data: {
            labels: [
                'Wins',
                'Losses',
            ],
            datasets: [{
                data: [300, 50],
                backgroundColor: [
                    'rgb(71, 202, 163)',
                    'rgb(255, 108, 108)',
                ],
                hoverOffset: 4
            }]
        }
    };

    res.render('./lol/lol-user-stats.ejs', { title: "LoL Stats Chart", loldata: lolTestData, chartdata: dataDonut });
});

webRouter.get("/lol/stats/:gamename", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const loldata = await GetLolUserData(_req.params.gamename);
        if (!loldata) throw new UserNotFoundError();

        Pino.info("rendering " + loldata.gameName + " stats " + loldata.gamesLast7Days);

        return res.render('./lol/lol-user-stats.ejs', { title: "LoL Stats", loldata });

    } catch (error) {
        const message = (error as Error).message;
        const name = (error as Error).name;
        Pino.info("Error getting stats" + name + message);

        next(error);
    }
});



export default webRouter;