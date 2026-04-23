import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sources: [
      {
        title: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
