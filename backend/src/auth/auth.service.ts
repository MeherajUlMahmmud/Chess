import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	ChangePasswordRequest,
	ChangePasswordResponse,
	LoginRequest,
	LoginResponse,
	SignUpRequest,
	SignUpResponse,
} from "./auth.interface";
import { config } from "../config/config";
import { logger } from "../utils/logger";

class AuthService {
	async signUp(data: SignUpRequest): Promise<SignUpResponse> {
		try {
			const { username, email, password } = data;

			// Check if the user already exists with the same email or username
			const existingUser = await User.findOne({
				$or: [{ email }, { username }],
			});
			if (existingUser) {
				return {
					data: null,
					message: "User already exists",
					status: "FAILED",
				};
			}
			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create a new user
			const newUser = new User({
				username,
				email,
				password: hashedPassword,
			});

			// Save the new user
			await newUser.save();

			return {
				data: {
					username: newUser.username,
					email: newUser.email,
				},
				message: "User successfully registered",
				status: "SUCCESS",
			};
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error during user sign-up", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error during user sign-up", { error });
			}
			throw new Error("An error occurred while signing up the user");
		}
	}

	async login(data: LoginRequest): Promise<LoginResponse> {
		try {
			const { email, password } = data;

			// Find the user by email
			const user = await User.findOne({ email });
			if (!user) {
				return {
					data: null,
					message: "Invalid email or password",
					status: "FAILED",
				};
			}

			// Compare the provided password with the hashed password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return {
					data: null,
					message: "Invalid email or password",
					status: "FAILED",
				};
			}

			// Generate access and refresh tokens
			const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, {
				expiresIn: "1h",
			});

			const refreshToken = jwt.sign(
				{ id: user._id },
				config.refreshTokenSecret,
				{
					expiresIn: "7d", // or another duration for the refresh token
				}
			);

			// Optionally store the refresh token in the database or an HTTP-only cookie

			return {
				data: {
					username: user.username,
					email: user.email,
					accessToken,
					refreshToken,
				},
				message: "Login successful",
				status: "SUCCESS",
			};
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error during user login", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error during user login", { error });
			}
			throw new Error("An error occurred while logging in");
		}
	}

	async changePassword(
		data: ChangePasswordRequest
	): Promise<ChangePasswordResponse> {
		try {
			const { userId, oldPassword, newPassword } = data;

			// Find the user by ID
			const user = await User.findById(userId);
			if (!user) {
				return {
					message: "User not found",
					status: "FAILED",
				};
			}

			// Compare the old password with the hashed password
			const isMatch = await bcrypt.compare(oldPassword, user.password);
			if (!isMatch) {
				return {
					message: "Old password is incorrect",
					status: "FAILED",
				};
			}

			// Hash the new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			user.password = hashedPassword;

			// Save the updated user
			await user.save();

			return {
				message: "Password successfully changed",
				status: "SUCCESS",
			};
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error("Error during password change", {
					error: error.message,
					stack: error.stack,
				});
			} else {
				logger.error("Unknown error during password change", { error });
			}
			throw new Error("An error occurred while changing the password");
		}
	}
}

export const authService = new AuthService();
