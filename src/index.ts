import { config } from "dotenv";
import audit from "express-requests-logger";
config();

// import { Client, LegacyClient, Auth } from 'osu-web.js';
// Client for the current API (API v2)
// const client = new Client('eUPnOYKsnu4dBD6BJzjtsrtFpf91r7LFK7MTkbAa');

import express, { Request, Response } from "express";
import { RiotPUUIDByTagName, RiotCallExample, Cs2CallExample } from "./calls.js";
import mainRouter from "./routes/mainRouter.js";

const app = express();

console.log("Initializing server...");

app.use(audit());

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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(mainRouter);

console.log();

const port = 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));