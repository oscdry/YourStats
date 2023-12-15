import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import express, { Request, Response } from "express";

const server = express();

console.log("Initializing server...");

server.get('/hola', async (req: Request, res: Response): Promise<void> => {
    res.sendStatus(200);
});

server.use(() => console.log('hola'));


const port = 8080;
server.listen(port, () => console.log(`Server listening on port ${port}`));