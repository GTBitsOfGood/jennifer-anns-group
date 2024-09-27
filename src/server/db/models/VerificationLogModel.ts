import {
  verificationLogSchema,
  VerificationLogType,
} from "../../../utils/types";
import mongoose from "mongoose";
import { z } from "zod";

const { Schema } = mongoose;

export interface IVerificationLog
  extends z.infer<typeof verificationLogSchema> {}

const VerificationLogSchema = new Schema<IVerificationLog>({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.String,
    enum: VerificationLogType,
    required: true,
  },
  token: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
  numAttemptsRemaining: {
    type: mongoose.Schema.Types.Number,
    default: -1,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
});

VerificationLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationLogModel =
  (mongoose.models.VerificationLog as mongoose.Model<IVerificationLog>) ??
  mongoose.model("VerificationLog", VerificationLogSchema);
export default VerificationLogModel;
