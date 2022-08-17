import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
    },
    isActive: {
      required: false,
      type: Boolean,
      default: true,
    },
    createdBy: {
      required: true,
      type: String, //todo change to object id
    },
    restaurant: {
      required: true,
      type: String, //todo change to object id
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Categories", dataSchema, "Categories");
