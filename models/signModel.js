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
  contacts: Array,
  isAvatarSet: {
    type: Boolean,
    default: false,
  },
  avatarImg: {
    type: String,
    default: '',
  },
});

const User = mongoose.model('User', userSchema);

export default User;
