export interface GetProfileResponse {
	data: {
		username: string;
		email: string;
	} | null;
	message: string;
	status: "SUCCESS" | "FAILED";
}

export interface UpdateProfileRequest {
	userId: string;
	username: string;
	email: string;
}

export interface UpdateProfileResponse {
	data: {
		username: string;
		email: string;
	} | null;
	message: string;
	status: "SUCCESS" | "FAILED";
}
