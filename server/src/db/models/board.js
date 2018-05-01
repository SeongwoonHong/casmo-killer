const mongoose = require('mongoose');
const Post = require('./post');

const { Schema } = mongoose;

const Board = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  boardId: String,
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  updated: [
    {
      title: String,
      contents: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // true => deleted
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('board', Board);
