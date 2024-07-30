import {
	GetProfileResponse,
	UpdateProfileRequest,
	UpdateProfileResponse,
} from "./user.interface";
import { User } from "./user.model";

class UserService {
	async getProfile(userId: string): Promise<GetProfileResponse> {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return {
				data: null,
				message: "User not found",
				status: "FAILED",
			};
		}
		return {
			data: {
				username: user.username,
				email: user.email,
			},
			message: "User found",
			status: "SUCCESS",
		};
	}

	async updateProfile(
		data: UpdateProfileRequest
	): Promise<UpdateProfileResponse> {
		const { userId, username, email } = data;
		const updates = {
			username,
			email,
		};

		if (!userId) {
			return {
				data: null,
				message: "User ID is required",
				status: "FAILED",
			};
		}

		const user = await User.findById(userId);
		if (!user) {
			return {
				data: null,
				message: "User not found",
				status: "FAILED",
			};
		}

		try {
			const updatedUser = await User.findByIdAndUpdate(userId, updates, {
				new: true,
				runValidators: true,
			});

			return {
				data: {
					username: updatedUser?.username || user?.username,
					email: updatedUser?.email || user?.email,
				},
				message: "User updated",
				status: "SUCCESS",
			};
		} catch (error) {
			console.log(error);
			return {
				data: null,
				message: "Error updating user",
				status: "FAILED",
			};
		}
	}
}

export const userService = new UserService();
