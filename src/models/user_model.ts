import { Schema, Document, model } from "mongoose";

// creating and exporting an interface
export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  purchases: string[];
  refresh_token: string;
  role: string;
}

// creating an schema || const userSchema: IUser = new Schema({...})
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  email: { type: String, required: true },
  purchases: {type: [String], default: []},
  refresh_token: { type: String },
  role: { type: String },
});

export const User = model<IUser>("User", userSchema);
