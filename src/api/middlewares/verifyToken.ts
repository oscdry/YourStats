import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { InvalidTokenError } from "../errors/errors.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Error, No JWT_SECRET set");
}

/**
 * Validates the login token (Optional).
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const verifyTokenOptional = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No optional token provided");
        return next();
    }

    res.locals.user = verifyToken(token) as TokenPayload;

    if (!res.locals.user) {
        console.log("No optional token provided");
        return next();
    }

    console.log("Token verified for user:", res.locals.user.username);
    next();
};

/**
 * Validates the login token (Required).
 * Returns the user to the home page if the token is not provided.
 * @param req
 * @param res
 * @param next
 */
export const verifyTokenRequired = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("No required token provided");
            throw new InvalidTokenError();
        }

        res.locals.user = verifyToken(token) as TokenPayload;
    } catch (error) {
        console.error("Error verifying token:", error);
        next(error);
    }
};

const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET!);
};