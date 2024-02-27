import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getUserByIdentifier } from "./userController.js";
import { generateTokenForUserId } from "./tokenController.js";

export const LoginUser = async (req: Request, res: Response) => {
    const { mail, password } = req.body;
    const user = await getUserByIdentifier(mail, res);


    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.hash);
    if (!validPassword) {
        return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateTokenForUserId({ id: user.id });
    return res.status(200).json({ token });
};