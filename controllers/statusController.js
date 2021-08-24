const { model } = require('mongoose');
const { ErrorHandler, catchAsync } = require('../utils');

const { Status } = require('../models');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('./factory');

exports.getAllStatus = catchAsync(async (req, res, next) => {
  const doc = await model('Friend')
    .aggregate()
    .match({ $or: [{ addUser: req.user._id }, { user: req.user._id }] })
    .group({ _id: '$user' })
    .lookup({
      from: model('Status').collection.name,
      localField: '_id',
      foreignField: 'user',
      as: 'all_status'
    })
    .lookup({
      from: model('User').collection.name,
      localField: '_id',
      foreignField: '_id',
      as: 'user'
    })
    .unwind('$all_status', '$user')
    .sort('-all_status.createdAt')
    .replaceRoot({
      $mergeObjects: ['$user', '$all_status']
    })
    .project('-stats -role -email -password -__v');

  res.status(200).json({
    success: true,
    requestedAt: req.requestTime,
    results: doc.length,
    data: { data: doc }
  });
});

// getAll(
//   Status,
//   {
//     path: 'user ', //comments
//     select: '-__v -passwordConfirm -email -role -stats',
//     populate: {
//       path: 'user',
//       select: '-__v -passwordConfirm -email -role -stats'
//     }
//   },
//   '-__v',
//   (i) => i.user
// );

exports.getOneStatus = getOne(Status);
exports.createStatus = createOne(Status);
exports.updateStatus = updateOne(Status);
exports.deleteStatus = deleteOne(Status);
// console.log(exports);
