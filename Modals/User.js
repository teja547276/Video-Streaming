// Backend/Modals/User.js
const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    followedAt: {
        type: Date,
        default: Date.now
    }
});

const followingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    followedAt: {
        type: Date,
        default: Date.now
    }
});
const userSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    followers:[followerSchema],
    following:[followingSchema]
    
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);