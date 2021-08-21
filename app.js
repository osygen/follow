const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-Parser');

const { ErrorHandler, globalErrorHandler } = require('./utils');
const {
  statusRoutes,
  userRoutes,
  commentRoutes,
  friendRoutes
} = require('./routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/status', statusRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/friend', friendRoutes);

app.all('*', (req, res, next) => {
  return next(
    new ErrorHandler(
      ` route: "${req.protocol}://${req.get('host')}/${
        req.originalUrl
      }" not found`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
