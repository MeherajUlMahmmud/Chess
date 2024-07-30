import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the User
interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt
	}
);

// Create the User model
const User = mongoose.model<IUser>("User", UserSchema);

export { IUser, User };
