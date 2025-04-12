import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    audioUrl: {
      type: String,
      required: false,
    },
    users: Array,
    sender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
