const mongoose = require('mongoose');

const { Schema } = mongoose;

const Board = new Schema({
  author: String,
  authorName: String,
  boardId: String,
  description: String,
  date: { type: Date, default: Date.now },
  updated: [{ title: String, contents: String, date: { type: Date, default: Date.now } }],
  deleted: { type: Boolean, default: false } // true => deleted
});

module.exports = mongoose.model('board', Board);
