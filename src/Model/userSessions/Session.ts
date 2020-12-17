import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  expires: { type: Date, required: true },
  session: { type: Object, required: true },
});

export const sessionModel = mongoose.model("usersessions", sessionSchema);
