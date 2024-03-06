import { NextFunction, Request, Response } from "express";

/**
 * Handles errors that are encountered in the application in order
 * to send them to the client in an expected format.
 * @param error
 * @param _req
 * @param res
 * @param _next
 * @author @polcondal
 */
export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Caught Error of type", error.name, error instanceof Error ? error.message : error);

    switch (error.name) {
        case "InvalidTokenError":
            return res.redirect("/");
        case "LoginError":
            return res.status(400).json({ error: "Invalid username or password" });
        case "RegisterError":
            return res.status(500).json({ error: "Error registering user" });
        case "UserNotFoundError":
            return res.status(404).json({ error: "User not found" });
        default:
            break;
    }
};