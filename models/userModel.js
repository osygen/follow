const { model, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const { ErrorHandler } = require('../utils');

const userSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },

    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      validate: [
        function (val) {
          return val.split(' ').length >= 2 && val.split(' ').length <= 3;
        },
        'please use firstname, lastname. Othername (optional)'
      ]
    },

    userName: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true,
      unique: true,
      minLength: [4, 'username is minimum of 5 characters'],
      maxLength: [10, 'username is maximum of 10 characters'],
      validate: [
        function (val) {
          return val.split(' ').length === 1;
        },
        'please provide a username'
      ]
    },

    email: {
      type: String,
      required: [true, 'Please add a valid email'],
      validate: [isEmail, 'Please provide a valid email'],
      unique: true,
      lowerCase: true
    },

    photo: { type: 'String', default: 'default.jpg' },

    role: {
      type: 'String',
      enum: ['user', 'admin'],
      default: 'user'
    },

    stats: {
      friends: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      follower: { type: Number, default: 0 }
    },

    password: {
      type: 'String',
      required: [true, 'Please provide a password'],
      minLength: [8, 'minimum of 8 characters'],
      select: false
    },

    passwordConfirm: {
      type: 'String',
      required: [true, 'Please provide a password'],
      validate: [
        function (val) {
          return val === this.password;
        },
        'Password mismatch. please ensure password matches'
      ]
    },
    passwordResetTime: 'Date',
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

userSchema.methods.comparePassWord = function (loggedPwd, UserPwd) {
  return bcrypt.compare(loggedPwd, UserPwd);
};

userSchema.methods.passwordSetAfter = function (iat) {
  return iat < Number.parseInt(this.passwordResetTime?.getTime() / 1000, 10);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordResetTime = Date.now() - 1000;

  next();
});

userSchema.post('remove', async function () {
  const friends = await model('Friend').find({
    $or: [{ user: this._id }, { addUser: { _id: this._id } }]
  });

  if (!friends.length) return;

  await model('Friend').deleteMany({
    _id: friends.map((f) => f._id.toHexString())
  });

  console.log(friends);

  friends
    .filter((f) => f.addUser !== null && `${f.addUser._id}` !== `${this._id}`)
    .forEach((f) => f.constructor.calStats(f.addUser._id));
});

module.exports = model('User', userSchema);
