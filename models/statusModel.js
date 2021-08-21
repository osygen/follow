const { model, Schema } = require('mongoose');

const statusSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },

    status: {
      type: String,
      required: [true, 'Status cannot be empty'],
      trim: true
    },

    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'status must belong to a user']
    }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

statusSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'status'
});

// statusSchema.pre('find', function (next) {
//   this.populate({
//   path: 'user',
//   match: { role: /^user$/i },
//   select: '-__v -passwordConfirm -email -role'
// });

//   next();
// });

statusSchema.pre(/^(find|findOne)$/i, async function (next) {
  this.populate({
    path: 'comments',
    options: {
      limit: this.op === 'find' ? 3 : undefined
      // skip: this.op === 'find' ? 2 : undefined
    },
    populate: { path: 'user', select: '-__v -passwordConfirm -email -role' }
  }).populate({
    path: 'user',
    // match: { role: /^admin$/i },
    select: '-__v -passwordConfirm -email -role'
  });

  next();
});

statusSchema.post('find', function (doc, next) {
  next();
});

module.exports = model('Status', statusSchema);
