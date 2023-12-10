const AppError = require('../../utils/appError');

// BMI = (Weight / height^2)
exports.BMI = (req, res, next) => {
  const Weight = req.query.weight;
  const Height = req.query.height;
  if (!Height || !Weight) {
    return next(new AppError('Please enter your weight or height', 404));
  }
  const bmi = ((Weight / (Height * Height)) * 10000).toFixed(1);
  let weightStatus = null;
  if (bmi >= 30) {
    weightStatus = 'Obesity';
  } else if (bmi >= 25 && bmi <= 29.9) {
    weightStatus = 'Overweight';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    weightStatus = 'Healthy Weight';
  } else {
    weightStatus = 'Underweight';
  }
  res.status(200).json({
    status: 'success',
    bmi,
    weightStatus
  });
};
