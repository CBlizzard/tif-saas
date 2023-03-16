import { Schema, model } from "mongoose";

interface RoleSchemaType {
  id: string;
  name: string;
  scope: string[];
  created_at: Date;
  updated_at: Date;
}

const RoleSchema = new Schema<RoleSchemaType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  scope: { type: [String], required: true, default: [] },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const RoleModel = model<RoleSchemaType>("Role", RoleSchema);
