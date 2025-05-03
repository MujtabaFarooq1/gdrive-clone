import mongoose, { Schema } from "mongoose";

const driveItemSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: false },
    type: { type: String, enum: ["file", "folder"], required: true },
    mimeType: { type: String },
    extension: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "DriveItem" },
    size: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isTrashed: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
  },
  { timestamps: true, autoIndex: true }
);

// Ensure name uniqueness per folder and user, excluding trashed items
driveItemSchema.index({ name: 1, parentId: 1, userId: 1 }, { unique: true });

export default mongoose.models.DriveItem ||
  mongoose.model("DriveItem", driveItemSchema);
