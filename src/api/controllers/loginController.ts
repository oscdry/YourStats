import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { getUserByIdentifier } from "./userController.js";
import { generateTokenForUserId } from "./tokenController.js";
import { LoginError } from "../errors/errors.js";
import Pino from "../../logger.js";

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (!username || !password) {
        Pino.debug("Empty username or password in login");
        throw new LoginError();
    }

    Pino.info("Login User" + JSON.stringify(req.body));

    try {

        const user = await getUserByIdentifier(username, 'username');
        if (!user) {
            Pino.debug("User with username: " + username + " not found in login");
            throw new LoginError();
        }

        const validPassword = await bcrypt.compare(password, user.hash);
        if (!validPassword) {
            Pino.debug("User with username: " + username + "  invalid password");
            throw new LoginError();
        }

        const payload: TokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = generateTokenForUserId(payload);

        Pino.info("User " + username + " logged in");
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
};