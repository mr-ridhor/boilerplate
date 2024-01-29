import { Router } from "express";
import authRoutes from "./v1/auth/authRoutes";
import userRoutes from "./v1/user/userRoutes";

const routes = Router();

/////////////////////////////////// ALL API VERSION 1 ROUTES ///////////////////////////////
// auth routes
routes.use("/api/v1/auth", authRoutes);

// user routes
routes.use("/api/v1/user", userRoutes);
export default routes;
