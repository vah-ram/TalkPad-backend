import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Group"
      },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    avatarImg: {
        type: String,
        default: '/messageIcons/group-image-png.png'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Group = mongoose.model( "Group", groupSchema );
