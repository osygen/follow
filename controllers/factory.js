const { ErrorHandler, catchAsync } = require('../utils');

exports.setReqBodyUser = async (req, res, next) => {
  req.body.user = req.user._id;

  next();
};

exports.unHandled = (msg) => (req, res, next) => {
  res.status(501).json({
    success: 'error',
    message: `route: ${req.protocol}://${req.get('host')}/${
      req.originalUrl
    } was not handled.${msg || ''}`
  });
};

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    res.status(200).json({
      success: true,
      requestedAt: req.requestTime,
      results: doc.length,
      data: { data: doc }
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(
        new ErrorHandler(`no resource found for id: ${req.params.id}`, 400)
      );

    res.status(200).json({
      success: true,
      requestedAt: req.requestTime,
      data: { data: doc }
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      success: true,
      requestedAt: req.requestTime,
      data: { data: doc }
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(
        new ErrorHandler(`no resource found for id: ${req.params.id}`, 400)
      );

    doc.status = req.body.status;
    await doc.save();

    res.status(200).json({
      success: true,
      requestedAt: req.requestTime,
      data: { data: doc }
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(
        new ErrorHandler(`no resource found for id: ${req.params.id}`, 400)
      );

    await doc.remove();

    res.status(204).json({
      success: true,
      requestedAt: req.requestTime,
      data: { data: null }
    });
  });
