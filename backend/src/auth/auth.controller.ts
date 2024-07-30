import { Request, Response } from "express";
import { authService } from "./auth.service";
import { logger } from "../utils/logger";
import {
	SignUpResponse,
	LoginResponse,
	ChangePasswordResponse,
} from "./auth.interface"; // Adjust the path as necessary

class AuthController {
	async signUp(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const response: SignUpResponse = await authService.signUp({
				username,
				email,
				password,
			});
			if (response.status === "FAILED") {
				logger.warn(response.message);
				res.status(400).json(response);
			} else {
				logger.info(
					`User signed up: ${response.data?.username}, Email: ${response.data?.email}`
				);
				res.status(201).json(response);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error signing up user", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error signing up user", { error });
			}
			res.status(500).json({
				message: "Internal Server Error",
				status: "FAILED",
			});
		}
	}

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const response: LoginResponse = await authService.login({
				email,
				password,
			});
			if (response.status === "SUCCESS") {
				logger.info(`User logged in: ${response.data?.username}`);
				res.status(200).json(response);
			} else {
				logger.warn(
					`Incorrect password for user: ${response.data?.username}`
				);
				res.status(400).json(response);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error logging in user", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error logging in user", { error });
			}
			res.status(500).json({
				message: "Internal Server Error",
				status: "FAILED",
			});
		}
	}

	async changePassword(req: Request, res: Response) {
		try {
			const { oldPassword, newPassword } = req.body;
			const userId = req.user?.id;

			if (!userId) {
				logger.warn("Change password attempt without user ID");
				return res.status(400).json({ error: "User ID is required" });
			}

			const response: ChangePasswordResponse =
				await authService.changePassword({
					userId,
					oldPassword,
					newPassword,
				});
			if (response.status === "SUCCESS") {
				logger.info(`User changed password successfully: ${userId}`);
				res.status(200).json(response);
			} else {
				logger.warn(`Incorrect old password for user ID: ${userId}`);
				res.status(400).json(response);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error changing password", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error changing password", { error });
			}
			res.status(500).json({
				message: "Internal Server Error",
				status: "FAILED",
			});
		}
	}
}

export const authController = new AuthController();
