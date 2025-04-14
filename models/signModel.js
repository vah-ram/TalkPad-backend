import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  avatarImg: {
    type: String,
    default: 'http://localhost:5000/uploadProfile/1744654339311-user-icon.jpg',
  },
});

const User = mongoose.model('User', userSchema);

export default User;
