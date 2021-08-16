const { errorHandler, catchAsync } = require('../utils');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    res.status(200).json({
      success: true,
      requestedAt: req.requestTime,
      results: doc.length,
      data: doc
    });

    next();
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    res
      .status(200)
      .json({ success: true, requestedAt: req.requestTime, data: doc });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const status = await Model.create(req.body);

    res
      .status(201)
      .json({ success: true, requestedAt: req.requestTime, data: status });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    doc.status = req.body.status;
    await doc.save();

    res
      .status(200)
      .json({ success: true, requestedAt: req.requestTime, data: doc });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    await doc.remove();

    res.status(204).json({ success: true, data: null });
  });
