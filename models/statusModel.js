const { model, Schema } = require('mongoose');

const statusSchema = new Schema(
  {
    status: {
      type: String,
      required: [true, 'Status cannot be empty'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }
  // { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = model('Status', statusSchema);
