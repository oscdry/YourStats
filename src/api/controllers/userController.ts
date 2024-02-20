import { type Request, type Response } from 'express';

export const createUser = (req: Request, res: Response) => {
    res.status(200).send({ msg: "Usuario creado correctamente" });
};