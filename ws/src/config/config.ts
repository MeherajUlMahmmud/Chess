import dotenv from "dotenv";

dotenv.config();

export const config = {
	jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
	refreshTokenSecret:
		process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret",
	dbUri: process.env.DB_URI || "mongodb://localhost:27017/chess_db",
	port: process.env.PORT || 3000,
};
