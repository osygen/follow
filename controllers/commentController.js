const { model } = require('mongoose');

const { Comment } = require('../models');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('./factory');

exports.getAllComment = getAll(Comment);
exports.getOneComment = getOne(Comment);
exports.createComment = createOne(Comment);
exports.updateComment = updateOne(Comment);
exports.deleteComment = deleteOne(Comment);
// console.log(exports);
