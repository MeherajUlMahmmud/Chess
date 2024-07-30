import { Request, Response, NextFunction } from "express";
import Joi from "joi";

class AuthValidator {
	validateLogin(req: Request, res: Response, next: NextFunction) {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}
		next();
	}

	validateSignUp(req: Request, res: Response, next: NextFunction) {
		const schema = Joi.object({
			username: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}
		next();
	}

	validateChangePassword(req: Request, res: Response, next: NextFunction) {
		const schema = Joi.object({
			oldPassword: Joi.string().required(),
			newPassword: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}
		next();
	}
}

export const authValidator = new AuthValidator();
