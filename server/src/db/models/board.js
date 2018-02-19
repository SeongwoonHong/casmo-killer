const mongoose = require('mongoose');
const Post = require('./post');


const { Schema } = mongoose;

const Board = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardId: String,
  description: String,
  date: { type: Date, default: Date.now },
  updated: [{ title: String, contents: String, date: { type: Date, default: Date.now } }],
  deleted: { type: Boolean, default: false } // true => deleted
});

module.exports = mongoose.model('board', Board);
