export interface SignUpRequest {
	username: string;
	email: string;
	password: string;
}

export interface SignUpResponse {
	data: {
		username: string;
		email: string;
	} | null;
	message: string;
	status: "SUCCESS" | "FAILED";
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	data: {
		username: string;
		email: string;
		accessToken: string;
		refreshToken: string;
	} | null;
	message: string;
	status: "SUCCESS" | "FAILED";
}

export interface ChangePasswordRequest {
	userId: string;
	oldPassword: string;
	newPassword: string;
}

export interface ChangePasswordResponse {
	message: string;
	status: "SUCCESS" | "FAILED";
}
