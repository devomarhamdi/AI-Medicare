const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const axios = require('axios');

exports.breast = async (req, res, next) => {
  const data = req.body;
  const url = 'https://breast-cancer-udq5.onrender.com/predict';

  axios
    .post(url, data)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      return next(new AppError(error.response.data.error));
    });
};
