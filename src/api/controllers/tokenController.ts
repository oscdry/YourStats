import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Error, No JWT_SECRET set");
}

export const generateTokenForUserId = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: "1d" });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET!) as TokenPayload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};