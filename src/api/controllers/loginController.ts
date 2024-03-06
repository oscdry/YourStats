import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { getUserByIdentifier } from "./userController.js";
import { generateTokenForUserId } from "./tokenController.js";
import { LoginError } from "../errors/errors.js";

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByIdentifier(username, 'username', res);
        console.log(user);

        if (!user)
            throw new LoginError();

        const validPassword = await bcrypt.compare(password, user.hash);
        console.log(validPassword);

        if (!validPassword)
            throw new LoginError();

        const payload: TokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = generateTokenForUserId(payload);
        console.log(token);

        return res.json({ token });
    } catch (error) {
        console.log("Caught Error:", error instanceof Error ? error.message : error);
        next(error);
    }
};