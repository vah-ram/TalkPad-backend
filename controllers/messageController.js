import Message from '../models/messageModel.js';

export const addMessage = async(req,res,next) => {
    const { from,to,message } = req.body;

    try {
        await Message.create({
            message: message,
            users: [from,to],
            sender: from
        })
    } catch(err) {
        next(err)
    }
};

export const getMessage = async(req,res,next) => {
    const { sender,receiver } = req.body;

    try {
        const users = await Message.find({
            users: { $all: [sender,receiver]}
        });
    
        const messages = users.map(user => {
            return {
                fromSelf: user.sender === sender ? true : false,
                message: user.message,
            };
        });
    
        return res.json({messages})
    } catch(err) {
        next(err)
    }
}