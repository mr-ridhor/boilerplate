import { Router } from "express";
import { getUser } from "../../../controllers/v1/user/userController";
import isAuthenticated from "../../../middlewares/v1/isAuthenticated";
import isVerified from "../../../middlewares/v1/isVerified";

const userRoutes = Router();

userRoutes.use(isAuthenticated, isVerified);

userRoutes.route("/").get(getUser);

export default userRoutes;
