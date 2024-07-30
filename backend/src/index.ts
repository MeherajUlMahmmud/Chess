import mongoose from "mongoose";
import { config } from "./config/config";
import { app } from "./app";

mongoose
	.connect(config.dbUri)
	.then(() => {
		console.log("Connected to the database");
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Database connection error:", error);
	});
