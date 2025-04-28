import Message from '../models/messageModel.js';
import { Group } from '../models/groupModel.js';

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message, image } = req.body;

    const isSavedMessage = from === to;

    const usersArray = isSavedMessage ? [from] : [...new Set([from, to])];

    const newMessage = await Message.create({
      message,
      imageUrl: image,
      users: usersArray,
      sender: from
    });

    res.json(newMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessage = async (req, res, next) => {
  const { sender, receiver } = req.query;

  try {
    const isGroup = await Group.findById(receiver);

    let messagesData = [];

    if (isGroup) {
      const groupMessages = await Message.find({
        users: { $in: [receiver] } 
      }).sort({ createdAt: 1 });

      messagesData = groupMessages.map(msg => ({
        fromSelf: msg.sender.toString() === sender,
        message: msg.message,
        image: msg.imageUrl,
        id: msg._id,
        createdAt: msg.createdAt,
      }));

    } else {
      const usersMessages = await Message.find({
        users: { $all: [sender, receiver] }
      }).sort({ createdAt: 1 });

      messagesData = usersMessages.map(msg => ({
        fromSelf: msg.sender.toString() === sender,
        message: msg.message,
        image: msg.imageUrl,
        id: msg._id,
        createdAt: msg.createdAt,
      }));
    }

    return res.json({ messages: messagesData });

  } catch (err) {
    next(err);
  }
};


  export const editMessage = async (req, res, next) => {
    const { messageId, editedMessage } = req.body;

    try {
      await Message.findByIdAndUpdate(
        messageId,
        { message: editedMessage },
        { new: true },
      );

    } catch(err) {
      next(err)
    }
  };
  
  export const deleteMessage = async (req, res, next) => {
    const { messageId } = req.query; 
    
    try {
      await Message.findByIdAndDelete(messageId);
    } catch(err) {
      next(err);
    }
  };
  