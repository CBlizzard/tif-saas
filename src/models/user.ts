import { Schema, model } from "mongoose";

interface UserSchemaType {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

const UserSchema = new Schema<UserSchemaType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const UserModel = model<UserSchemaType>("User", UserSchema);
