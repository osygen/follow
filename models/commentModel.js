const { model, Schema } = require('mongoose');

const commentSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },

    comment: {
      type: String,
      required: [true, 'Status cannot be empty'],
      trim: true
    },

    createdAt: {
      type: Date,
      default: Date.now()
    },

    userId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'comment must belong to a user']
    },

    statusId: {
      type: Schema.ObjectId,
      ref: 'Status',
      required: [true, 'comment must belong to a status']
    }
  }
  // ,{ toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = model('Comment', commentSchema);
