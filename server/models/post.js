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
  count: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  updated: [{ title: String, contents: String, date: { type: Date, default: Date.now } }],
  deleted: { type: Boolean, default: false } // true => deleted
},
{
  toObject: { virtuals: true }
});

// functions
function get2digits(num) {
  return (`0${num}`).slice(-2);
}
function getDate(dateObj) {
  if (dateObj instanceof Date) {
    return `${dateObj.getFullYear()}-${get2digits(dateObj.getMonth() + 1)}-${get2digits(dateObj.getDate())}`;
  }
}

function getTime(dateObj) {
  if (dateObj instanceof Date) {
    return `${get2digits(dateObj.getHours())}:${get2digits(dateObj.getMinutes())}:${get2digits(dateObj.getSeconds())}`;
  }
}

// virtuals
Post.virtual('createdDate')
  .get(() => {
    return getDate(this.date);
  });

Post.virtual('createdTime')
  .get(() => {
    return getTime(this.date);
  });

Post.virtual('updatedDate')
  .get(() => {
    return getDate(this.updated);
  });

Post.virtual('updatedTime')
  .get(() => {
    return getTime(this.updated);
  });

Post.plugin(AutoIncrement, { inc_field: 'postNum' });
Post.plugin(timestamps);

module.exports = mongoose.model('post', Post);
