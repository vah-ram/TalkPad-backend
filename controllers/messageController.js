import Message from '../models/messageModel.js';

export const addMessage = async(req,res,next) => {
    const { from,to,message,image } = req.body;

    try {
        const messages = await Message.create({
            message: message,
            imageUrl: image,
            users: [from,to],
            sender: from
        });

        res.json(messages);
        
    } catch(err) {
        next(err)
    }
};

export const getMessage = async (req, res, next) => {
    const { sender, receiver } = req.query; 
  
    try {
      const users = await Message.find({
        users: { $all: [sender, receiver] }
      }).sort({ createdAt: 1 });
  
      const messages = users.map(user => {
        return {
          fromSelf: user.sender === sender ? true : false,
          message: user.message,
          image: user.imageUrl,
          id: user._id,
          createdAt: user.createdAt
        };
      });
  
      return res.json({ messages });
    } catch (err) {
      next(err);
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
  