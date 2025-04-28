import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    default: "User"
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
    default: '/messageIcons/user-icon.jpg',
  }
});

const User = mongoose.model('User', userSchema);

export default User;
