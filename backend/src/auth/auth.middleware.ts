import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const authenticateJWT = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({
				message: "Access denied, token missing",
				status: "FAILED",
			});
	}

	try {
		const verified = jwt.verify(token, config.jwtSecret) as { id: string };
		req.user = verified;
		next();
	} catch (error) {
		res.status(401).json({
			message: "Invalid token",
			status: "FAILED",
		});
	}
};
