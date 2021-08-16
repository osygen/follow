const express = require('express');
const morgan = require('morgan');

const { errorHandler, catchAsync, globalErrorHandler } = require('./utils');
const { statusRoutes } = require('./routes');

const app = express();
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/status', statusRoutes);

app.all('*', (req, res, next) => {
  return next(
    new errorHandler(
      `route: ${req.protocol}://${req.get('host')}/${
        req.originalUrl
      } was not defined/handled`,
      400
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
