const mongoose = require('mongoose');

// this is our schema to represent a blog post
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  created: {type: Date, default: Date.now}
})


postSchema.methods.apiRepr = function() {
  return {
    //added ID so that I can search in Postman using it
    id: this.id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
  };
}

postSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

const post = mongoose.model('post', postSchema);

module.exports = {post};