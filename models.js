const mongoose = require('mongoose');

// this is our schema to represent a blog post
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  created: {type: Number, required: true}
})


postSchema.methods.apiRepr = function() {

  return {
    title: this.title,
    content: this.content,
    author: this.author,
    created: this.created,
  };
}

const post = mongoose.model('post', postSchema);

module.exports = {post};