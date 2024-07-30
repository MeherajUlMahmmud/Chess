import { Request, Response } from "express";
import { userService } from "./user.service";
import { logger } from "../utils/logger";
import { GetProfileResponse, UpdateProfileResponse } from "./user.interface";

class UserController {
	async getProfile(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return res.status(400).json({
					message: "User ID is required",
					status: "FAILED",
				});
			}

			const response: GetProfileResponse = await userService.getProfile(
				userId
			);
			if (response) {
				res.status(200).json(response);
			} else {
				res.status(404).json({ error: "User not found" });
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error fetching user profile", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error fetching user profile", { error });
			}
			res.status(500).json({
				message: "Internal Server Error",
				status: "FAILED",
			});
		}
	}

	async updateProfile(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return res.status(400).json({
					message: "User ID is required",
					status: "FAILED",
				});
			}

			const updates = req.body;
			const response: UpdateProfileResponse =
				await userService.updateProfile({
					userId,
					username: updates.username,
					email: updates.email,
				});
			if (response.status === "SUCCESS") {
				res.status(200).json(response);
			} else {
				res.status(404).json(response);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error updating user profile", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error updating user profile", { error });
			}
			res.status(500).json({
				message: "Internal Server Error",
				status: "FAILED",
			});
		}
	}
}

export const userController = new UserController();
