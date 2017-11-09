const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const timestamps = require('mongoose-timestamp');

const { Schema } = mongoose;

const Post = new Schema({
  authorId: String,
  authorName: String,
  title: String,
  contents: String,
  categories: [String],
  starred: [String],
});

Post.plugin(AutoIncrement, { inc_field: 'postNum' });
Post.plugin(timestamps);
module.exports = mongoose.model('post', Post);
