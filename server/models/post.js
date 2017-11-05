const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const Post = new Schema({
  writer: String,
  title: String,
  contents: String,
  starred: [String],
  date: {
    created: { type: Date, default: Date.now },
    edited: { type: Date, default: Date.now }
  },
  is_edited: { type: Boolean, default: false }
});

Post.plugin(AutoIncrement, { inc_field: 'postNum' });
module.exports = mongoose.model('post', Post);
