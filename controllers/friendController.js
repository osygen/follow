const { model } = require('mongoose');
const { Friend } = require('../models');
const { unHandled } = require('./factory');

const { catchAsync, ErrorHandler } = require('../utils');

exports.checkCreateFriend = (req, res, next) => {
  ['createdAt', 'following', 'followed', 'friends'].forEach(
    (item) => delete req.body[item]
  );

  req.body.addUser = req.params.addUser || req.body.addUser;

  req.body.user = req.user._id;

  next();
};

exports.createFriend = unHandled('Please use post/api/v1/friend/<:id>/req');
exports.updateFriend = unHandled('Please use post/api/v1/friend/<:id>/req');
exports.deleteFriend = unHandled('Please use post/api/v1/friend/<:id>/req');

exports.getAllFriend = unHandled();
exports.getOneFriend = unHandled();

exports.friendRequest = catchAsync(async (req, res, next) => {
  let doc = await Friend.findOne(req.body);
  if (!doc) {
    const docc = await Friend.create(req.body);
    Friend.follow(docc);

    res.status(201).json({
      success: true,
      requestedAt: req.requestTime,
      data: { data: docc }
    });
  }

  if (doc) {
    doc = await Friend.updateFollow(doc, req.body.addUser);
    await doc?.save();

    res.status(!doc ? 204 : 200).json({
      success: true,
      requestedAt: req.requestTime,
      data: doc ? { data: doc } : { data: undefined },
      message: !doc ? 'You have both unfollow' : undefined
    });
  }
});
