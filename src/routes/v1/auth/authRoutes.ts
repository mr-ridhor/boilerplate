import { Router } from "express";
import {
  authCheckVerification,
  authLogin,
  authRegister,
  authResendVerification,
  authVerify,
} from "../../../controllers/v1/auth/authController";
import {
  authLoginValidation,
  authRegisterValidation,
} from "../../../validations/v1/auth/authValidation";
import isAuthenticated from "../../../middlewares/v1/isAuthenticated";

const authRoutes = Router();

authRoutes.route("/register").post(authRegisterValidation, authRegister);
authRoutes.route("/login").post(authLoginValidation, authLogin);

authRoutes
  .route("/check-verification")
  .get(isAuthenticated, authCheckVerification);
authRoutes.route("/verify").post(isAuthenticated, authVerify);
authRoutes
  .route("/resend-verification")
  .post(isAuthenticated, authResendVerification);

export default authRoutes;
