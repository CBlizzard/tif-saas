import { Schema, model } from "mongoose";

interface CommunitySchemaType {
  id: string;
  name: string;
  slug: string;
  owner: string;
  created_at: Date;
  updated_at: Date;
}

const CommunitySchema = new Schema<CommunitySchemaType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const CommunityModel = model<CommunitySchemaType>("Community", CommunitySchema);
