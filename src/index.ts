import { config } from "dotenv";
config();

import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import expressLayouts from 'express-ejs-layouts';
import audit from "express-requests-logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// import { Client, LegacyClient, Auth } from 'osu-web.js';
// Client for the current API (API v2)
// const client = new Client('eUPnOYKsnu4dBD6BJzjtsrtFpf91r7LFK7MTkbAa');

import { RiotPUUIDByTagName, RiotCallExample, Cs2CallExample } from "./calls.js";
import mainRouter from "./routes/mainRouter.js";
// import { getUserById } from "./api/controllers/userController.js";
import webRouter from "./routes/web.js";

const app = express();

app.use(express.json());

console.log("Initializing server...");

app.use(audit());
app.use(express.static(path.join(__dirname, '../public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);

// server.get('/hola', async (req: Request, res: Response): Promise<void> => {
//     res.sendStatus(200);
// });

// server.use(() => console.log('hola'));

// console.log("RiotAcc:");
// await RiotPUUIDByTagName("OSCDRY", "Jonan");

// console.log("RiotCall:");
// await RiotCallExample();

// // API v2
// let v2User = await client.users.getUser(16615204, {
//     urlParams: {
//         mode: 'osu'
//     }
// });
// console.log(v2User.id);

// const cs2 = await Cs2CallExample("76561198161126716");

// console.log(JSON.stringify(cs2));
app.use('/api', mainRouter);
app.use(webRouter);

// console.log(await getUserById(1));

const port = 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));