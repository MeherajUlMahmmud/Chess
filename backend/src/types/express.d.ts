import { IUser } from "../user/user.model";

declare global {
	namespace Express {
		interface Request {
			user?: { id: string } | IUser;
		}
	}
}
