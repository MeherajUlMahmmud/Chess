import express from "express";
import cors from "cors";

import { authController } from "./auth/auth.controller";
import { authValidator } from "./auth/auth.validator";
import { userController } from "./user/user.controller";
import { userValidator } from "./user/user.validator";
import { authenticateJWT } from "./auth/auth.middleware";

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

app.post("/auth/signup", authValidator.validateSignUp, authController.signUp);
app.post("/auth/login", authValidator.validateLogin, authController.login);
app.post(
	"/auth/change-password",
	authenticateJWT,
	authValidator.validateChangePassword,
	authController.changePassword
);

app.get("/user/profile", authenticateJWT, userController.getProfile);
app.put(
	"/user/profile",
	authenticateJWT,
	userValidator.validateUpdateProfile,
	userController.updateProfile
);

export { app };
