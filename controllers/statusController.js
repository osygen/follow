const { model } = require('mongoose');

const { Status } = require('../models');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('./factory');

exports.getAllStatus = getAll(Status);
exports.getOneStatus = getOne(Status);
exports.createStatus = createOne(Status);
exports.updateStatus = updateOne(Status);
exports.deleteStatus = deleteOne(Status);
// console.log(exports);
