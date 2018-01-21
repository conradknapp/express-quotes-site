const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate: {
      type: Date,
      default: Date.now
    },
    commentUser: {
      type: Schema.Types.ObjectId,
      // need to provide reference model (which is called 'users')
      ref: 'users'
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = mongoose.model('quotes', QuoteSchema, 'quotes');