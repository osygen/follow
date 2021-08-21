const { User } = require('../models');

const {
  getAll,
  getOne,
  // createOne,
  updateOne,
  deleteOne,
  unHandled
} = require('./factory');

exports.getAllUser = getAll(User);
exports.getOneUser = getOne(User);
exports.createUser = unHandled(' Please use /api/v1/user/signup ');
exports.updateUser = updateOne(User);

exports.deleteUser = async (req, res) => {
  // = deleteOne(User);
  const user = await User.findById(req.params.id);

  user.remove();

  res.status(204).json();
};

// console.log(exports);
