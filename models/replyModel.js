const { model, Schema } = require('mongoose');

const replySchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },

    reply: {
      type: String,
      required: [true, 'reply cannot be empty'],
      trim: true
    },

    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'reply must belong to a user']
    },

    comment: {
      type: Schema.ObjectId,
      ref: 'Comment',
      required: [true, 'reply must belong to a comment']
    }
  }
  //   ,{ toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = model('Reply', replySchema);
