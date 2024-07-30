import { Request, Response, NextFunction } from "express";
import Joi from "joi";

class UserValidator {
	validateUpdateProfile = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const schema = Joi.object({
			username: Joi.string(),
			email: Joi.string().email(),
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}
		next();
	};
}

export const userValidator = new UserValidator();
