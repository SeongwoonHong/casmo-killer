const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const timestamps = require('mongoose-timestamp');

const { Schema } = mongoose;

const Post = new Schema({
  authorId: String,
  authorName: String,
  // password: { type: String, select: false },
  title: String,
  contents: String,
  boardId: String,
  comments: [{
    name: String,
    id: String,
    memo: String,
    date: { type: Date, default: Date.now }
  }],
  categories: [String],
  commentsCount: { type: Number, default: 0 },
  count: { type: Number, default: 0 }, // View
  date: { type: Date, default: Date.now },
  updated: [{ title: String, contents: String, date: { type: Date, default: Date.now } }],
  deleted: { type: Boolean, default: false } // true => deleted
});

Post.plugin(AutoIncrement, { inc_field: 'postNum' });
Post.plugin(timestamps);

module.exports = mongoose.model('post', Post);
