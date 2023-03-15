import { Schema, model } from "mongoose";

interface MemberSchemaType {
  id: string;
  community: string;
  user: string;
  role: string;
  created_at: Date;
}

const MemberSchema = new Schema<MemberSchemaType>({
  id: { type: String, required: true, unique: true },
  community: { type: String, required: true },
  user: { type: String, required: true },
  role: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const MemberModel = model<MemberSchemaType>("Member", MemberSchema);
