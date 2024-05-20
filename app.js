const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const patientRouter = require('./routes/patientRoutes');
const doctorRouter = require('./routes/doctorRoutes');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors({ origin: '*' }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const url = 'https://breast-cancer-udq5.onrender.com';

axios
  .get(url)
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    return console.log(error.config.url);
  });

app.use('/api/users', userRouter);
app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorRouter);

app.use('/', (req, res) => {
  return res.send('Welcome to AI Medicare');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
