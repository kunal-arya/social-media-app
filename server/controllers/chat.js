import ChatModel from "../models/Chat.js";

export const createChat = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    if (senderId === null || !receiverId === null) {
      res.status(404).json({ error: "senderId or ReceiverId is null" });
    }

    if (senderId === receiverId) {
      res.status(404).json({ error: "senderId and receiverId is Same" });
    }

    const isChatAlreadyCreated = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (isChatAlreadyCreated) {
      return res
        .status(200)
        .json({ message: "chat already exist between users" });
    }

    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    const result = await newChat.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const userChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chat = await ChatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findChat = async (req, res) => {
  try {
    const firstId = req.params.firstId;
    const secondId = req.params.secondId;

    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
