const AppError = require('../../utils/appError');

// BMI = (Weight / height^2)
exports.BMI = (req, res, next) => {
  const Weight = req.query.weight;
  const Height = req.query.height;
  if (!Height || !Weight) {
    return next(new AppError('Please enter your weight or height', 404));
  }
  const bmi = (Weight / (Height * Height)) * 10000;
  res.status(200).json({
    status: 'success',
    bmi
  });
};
