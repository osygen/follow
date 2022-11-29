const promisify = require('util').promisify;

const { model, Schema } = require('mongoose');
const jwt = require('jsonWebToken');
const bcrypt = require('bcryptjs');

const { User } = require('../models');
const { catchAsync, ErrorHandler } = require('../utils');

exports.checkSignup = catchAsync(async (req, res, next) => {
  ['role', 'active', 'passwordResetTime', 'stats'].forEach(
    (item) => delete req.body[item]
  );

  next();
});

exports.signupUser = catchAsync(async (req, res, next) => {
  req.user = await User.create(req.body);

  req.user.active =
    req.user.role =
    req.user.password =
    req.user.__v =
      undefined;

  next();
});

exports.checkLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email?.trim() && password?.trim()))
    return next(new ErrorHandler('please provide email and password', 401));

  next();
});

exports.loginUser = catchAsync(async (req, res, next) => {
  req.user = await model('User')
    .findOne({ email: req.body.email })
    .select('password');

  if (!(await req.user?.comparePassWord(req.body.password, req.user.password)))
    return next(
      new ErrorHandler('invalid email or password, please try again', 401)
    );

  req.user.password = undefined;

  next();
});

exports.createTokenRes = catchAsync(async (req, res, next) => {
  const token = await promisify(jwt.sign)(
    { id: req.user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP_IN
    }
  );

  res
    .status(201)
    .cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: true
    })
    .json({
      success: true,
      token,
      requestedAt: req.requestTime,
      data: req.user
    });
});

exports.logout = async (req, res) => {
  res
    .status(200)
    .cookie('jwt', 'loggedout', {
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: true
    })
    .json({
      status: 'success'
    });
};

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    (req.headers?.authorization?.startWith('Bear ') &&
      req.headers.authorization.split(' ')[1]) ||
    req.cookies?.jwt;

  if (!token) return next(new ErrorHandler('Please login to get access', 401));

  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  let curUser = await User.findById(id);

  if (!curUser || curUser.passwordSetAfter(iat))
    return next(new ErrorHandler('Please login to get access', 401));

  res.locals.user = req.user = curUser;

  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role))
      return next(new ErrorHandler('you are not authorized', 401));

    next();
  };
};
