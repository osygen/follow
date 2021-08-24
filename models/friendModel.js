const { model, Schema } = require('mongoose');

const friendSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },

    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, '. Please login']
    },

    addUser: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user to follow.'],
      validate: [
        {
          validator: function (val) {
            return val._id.toHexString() !== this.user._id.toHexString();
          },
          message: 'Oops, you can not follow yourself 💥'
        },
        {
          validator: async function (val) {
            return await model('User').findById(val);
          },
          message: `no user found for the id: ({VALUE})`
        }
      ]
    },

    following: {
      type: Boolean,
      default: true
    },

    followed: {
      type: Boolean,
      default: false
    },

    friends: {
      type: String,
      default: 'pending',
      enum: ['pending', 'friends']
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

friendSchema.index({ user: 1, addUser: 1 }, { unique: true });

friendSchema.statics.follow = async function (user) {
  Friend.create({
    addUser: user.user,
    user: user.addUser,
    following: false,
    followed: true,
    friends: 'pending'
  });
};

friendSchema.statics.updateFollow = async function (userA, addUserID) {
  userA.following = userA.following ? false : true;

  const userB = await Friend.findOne({
    addUser: userA.user._id,
    user: userA.addUser._id
  });

  if (!userA.following && !userB.following) {
    await Friend.deleteMany({ _id: [userA._id, userB._id] });
    await Friend.calStats(userB.user._id);
    await Friend.calStats(userA.user._id);

    return null;
  }
  userB.followed = userA.following ? true : false;
  userB.friends = userA.following && userB.following ? 'friends' : 'pending';
  userB.save();

  userA.followed = userB.following ? true : false;
  userA.friends = userA.following && userB.following ? 'friends' : 'pending';
  return userA;
};

friendSchema.statics.calStats = async function (id) {
  const aggStats = await this.aggregate([
    {
      $match: { user: id }
    }
  ]).facet({
    following: [{ $match: { following: true } }, { $count: 'following' }],
    follower: [{ $match: { followed: true } }, { $count: 'follower' }],
    friends: [{ $match: { friends: 'friends' } }, { $count: 'friends' }]
  });

  let stats = {};
  Object.keys(aggStats[0]).forEach((key) => {
    stats[key] = aggStats[0][key][0]?.[key] ?? 0;
  });

  await model('User').findByIdAndUpdate(id, { stats });
};

friendSchema.post(['save', 'remove'], async function (doc, next) {
  doc.constructor.calStats(doc.user._id);
  next();
});

// friendSchema.pre([/^find/], async function (next) {
//   this.populate({
//     path: 'addUser',
//     select: 'name email photo'
//   });

//   next();
// });

const Friend = model('Friend', friendSchema);
module.exports = Friend;
