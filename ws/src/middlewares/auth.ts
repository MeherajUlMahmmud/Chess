import { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const authenticate = (
	ws: WebSocket,
	req: Request,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		ws.send(JSON.stringify({ error: "No token provided" }));
		ws.close();
		return;
	}

	jwt.verify(token, config.jwtSecret, (err, decoded) => {
		if (err) {
			ws.send(JSON.stringify({ error: "Invalid token" }));
			ws.close();
			return;
		}

		req.user = decoded;
		next();
	});
};
