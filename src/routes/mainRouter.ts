import { Request, Response, Router } from "express";
import { createUser, getUserByIdentifier, deleteUser, updateUser } from "../api/controllers/userController.js";
import { validateCreateUser } from "../api/middlewares/createUsersMiddleware.js";
import { validateUpdateUser } from "../api/middlewares/updateUserMiddleware.js";
import { LoginUser } from "../api/controllers/loginController.js";
import { validateUserIdentifier } from "../api/middlewares/validateUserIdentifier.js";
import { errorHandler } from "../api/middlewares/errorHandler.js";


const mainRouter = Router();

mainRouter.post("/login", LoginUser);
mainRouter.use(errorHandler);

mainRouter.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

mainRouter.post("/createUser", validateCreateUser, createUser);
// mainRouter.get("/getUser/:identifier", validateUserIdentifier, getUserById);
mainRouter.delete("/deleteUser/:identifier", validateUserIdentifier, deleteUser);
mainRouter.put("/updateUser/:identifier", validateUserIdentifier, validateUpdateUser, updateUser);



export default mainRouter;