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
  const doc = (await Status.find()).filter((i) => i.user);

  res.status(200).json({
    success: true,
    requestedAt: req.requestTime,
    results: doc.length,
    data: doc
  });
});
exports.getOneStatus = getOne(Status);
exports.createStatus = createOne(Status);
exports.updateStatus = updateOne(Status);
exports.deleteStatus = deleteOne(Status);
// console.log(exports);
