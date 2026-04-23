import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";

export const startConversationController = async (req, res) => {
  try {
    const convo = await conversationModel.create({
      title: "",
      userId: req.user.id,
    });

    res.json({ conversation: convo });
  } catch (err) {
    res.status(500).json({ message: "Error creating conversation" });
  }
};

export const getConversationController = async (req, res) => {
  try {
    const conversations = await conversationModel
      .find({
        userId: req.user.id,
      })
      .sort({ createdAt: -1 });

    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations" });
  }
};
export const getSpecificMessages = async (req, res) => {
  try {
    const convo = await conversationModel.findOne({
      _id: req.params.conversationId,
      userId: req.user.id,
    });

    if (!convo) {
      return res.status(403).json({ message: "Access denied" });
    }
    const messages = await messageModel
      .find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
