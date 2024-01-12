import { PrismaClient } from '@prisma/client';
import { config } from "dotenv";
config();

import { Client, LegacyClient, Auth } from 'osu-web.js';
// Client for the current API (API v2)
const client = new Client('eUPnOYKsnu4dBD6BJzjtsrtFpf91r7LFK7MTkbAa');

const prisma = new PrismaClient();

import express, { Request, Response } from "express";
import { RiotPUUIDByTagName, RiotCallExample } from "./calls.js";

const server = express();

console.log("Initializing server...");

// server.get('/hola', async (req: Request, res: Response): Promise<void> => {
//     res.sendStatus(200);
// });

// server.use(() => console.log('hola'));

// console.log("RiotAcc:");
// await RiotPUUIDByTagName("OSCDRY", "Jonan");

// console.log("RiotCall:");
// await RiotCallExample();

// // API v2
let v2User = await client.users.getUser(16615204, {
    urlParams: {
        mode: 'osu'
    }
});
// console.log(v2User.id);


const port = 8080;
server.listen(port, () => console.log(`Server listening on port ${port}`));