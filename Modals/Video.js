const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videoLink: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    videoType: {
        type: String,
        default: "All"
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }]
}, { timestamps: true });

module.exports = mongoose.model('video', videoSchema);