const { User, Friend } = require('../models');
const { catchAsync } = require('../utils');

const {
  // getAll,
  getOne,
  // createOne,
  updateOne,
  // deleteOne,
  unHandled
} = require('./factory');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 1;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const sort = req.query.sort?.split(',').join(' ') || 'createdAt';

  const doc = await User.aggregate()
    // .match({ _id: { $ne: req.user._id } })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lookup({
      from: Friend.collection.name,
      localField: '_id',
      foreignField: 'addUser',
      as: 'join'
    })
    .replaceRoot({
      $mergeObjects: [
        {
          $cond: {
            if: { $eq: ['$_id', req.user._id] },
            then: { following: null, followed: null, friends: null },
            else: { following: false, followed: false, friends: 'pending' }
          }
        },
        {
          $arrayElemAt: [
            {
              $filter: {
                input: '$join',
                as: 'item',
                cond: { $eq: ['$$item.user', req.user._id] }
              }
            },
            0
          ]
        },
        '$$ROOT'
      ]
    })
    // .addFields({
    //   'connection.following': '$following',
    //   'connection.followed': '$followed',
    //   'connection.friends': '$friends'
    // })

    .project('-password -__v -role -addUser -user  -join');

  res.status(200).json({
    success: true,
    requestedAt: req.requestTime,
    results: doc.length,
    data: { data: doc }
  });
});

// getAll(User, {
//   path: 'status friends',
//   populate: {
//     path: 'user addUser',
//     select: 'name email photo'
//   }
// });
exports.getOneUser = getOne(User);
exports.createUser = unHandled(' Please use /api/v1/user/signup ');
exports.updateUser = updateOne(User);

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.remove();

  res.status(204).json();
};

// console.log(exports);
