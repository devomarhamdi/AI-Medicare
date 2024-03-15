const AppError = require('../../utils/appError');

// BMI
exports.BMI = (req, res, next) => {
  // Get input parameters from req.query
  const { weight, height } = req.query;

  // Check if all required parameters are present
  if (!weight || !height) {
    return next(new AppError('Missing required parameters'), 400);
  }

  // Convert parameters to numbers
  const weightInKg = parseFloat(weight);
  const heightInM = parseFloat(height) / 100; // Convert height to meters

  // Check if conversion was successful
  if (isNaN(weightInKg) || isNaN(heightInM)) {
    return next(new AppError('Invalid input parameters'), 400);
  }

  // Calculate BMI
  const bmi = weightInKg / (heightInM * heightInM);

  // Determine weight status
  let weightStatus;
  if (bmi < 18.5) {
    weightStatus = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    weightStatus = 'Normal weight';
  } else if (bmi >= 25 && bmi < 29.9) {
    weightStatus = 'Overweight';
  } else {
    weightStatus = 'Obese';
  }

  return res.json({
    BMI: bmi.toFixed(1),
    weightStatus
  });
};

// BMR
exports.BMR = (req, res, next) => {
  const { age, gender, weight, height, activityLevel } = req.query;

  // Check if required parameters are provided
  if (!age || !gender || !weight || !height || !activityLevel) {
    return next(new AppError('Missing required parameters.', 400));
  }

  // Convert string inputs to numbers
  const numericAge = parseFloat(age);
  const numericWeight = parseFloat(weight);
  const numericHeight = parseFloat(height);

  // Check if the conversion was successful
  if (isNaN(numericAge) || isNaN(numericWeight) || isNaN(numericHeight)) {
    return next(new AppError('Invalid numeric input.', 400));
  }

  // BMR calculation
  let bmr;
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender.toLowerCase() === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    return next(
      new AppError('Invalid gender. Please use "male" or "female".', 400)
    );
  }

  // TDEE calculation based on activity level
  let tdee;
  switch (activityLevel.toLowerCase()) {
    case 'sedentary':
      tdee = bmr * 1.2;
      break;
    case 'lightly active':
      tdee = bmr * 1.375;
      break;
    case 'moderately active':
      tdee = bmr * 1.55;
      break;
    case 'very active':
      tdee = bmr * 1.725;
      break;
    case 'extra active':
      tdee = bmr * 1.9;
      break;
    default:
      return next(new AppError('Invalid activity level.', 400));
  }

  res.json({
    bmr: {
      value: bmr,
      description: 'Basal Metabolic Rate (BMR) in kcal'
    },
    tdee: {
      value: tdee,
      description:
        'Total Daily Energy Expenditure (TDEE) in kcal, including physical activity'
    }
  });
};

/* Body Fat male: { min: 18, max: 99 },
            female: { min: 18, max: 99 },
            boy: { min: 6, max: 17 },
            girl: { min: 6, max: 17 }
*/
exports.bodyFat = (req, res, next) => {
  const { gender, height, weight, age } = req.query;

  // Check if required parameters are provided
  if (!gender || !height || !weight || !age) {
    return next(new AppError('Missing required parameters.', 400));
  }

  // Convert string inputs to numbers
  const numericHeight = parseFloat(height);
  const numericWeight = parseFloat(weight);
  const numericAge = parseFloat(age);

  // Check if the conversion was successful
  if (isNaN(numericHeight) || isNaN(numericWeight) || isNaN(numericAge)) {
    return next(new AppError('Invalid numeric input.', 400));
  }

  // Calculate BMI
  const bmi = numericWeight / Math.pow(numericHeight / 100, 2);

  // Check age limits based on gender
  const ageLimits = {
    male: { min: 18, max: 99 },
    female: { min: 18, max: 99 },
    boy: { min: 6, max: 17 },
    girl: { min: 6, max: 17 }
  };

  if (
    numericAge < ageLimits[gender.toLowerCase()].min ||
    numericAge > ageLimits[gender.toLowerCase()].max
  ) {
    return next(new AppError(`Invalid age for ${gender}.`, 400));
  }

  // Use BMI to estimate body fat percentage
  let bodyFatPercentage;
  if (gender.toLowerCase() === 'male') {
    bodyFatPercentage = 1.2 * bmi + 0.23 * numericAge - 16.2;
  } else if (gender.toLowerCase() === 'female') {
    bodyFatPercentage = 1.2 * bmi + 0.23 * numericAge - 5.4;
  } else if (gender.toLowerCase() === 'boy') {
    bodyFatPercentage = 1.51 * bmi - 0.7 * numericAge - 2.2;
  } else if (gender.toLowerCase() === 'girl') {
    bodyFatPercentage = 1.51 * bmi - 0.7 * numericAge + 1.4;
  } else {
    return next(
      new AppError(
        'Invalid gender. Please use "male", "female", "boy", or "girl".',
        400
      )
    );
  }

  res.json({
    bodyFatPercentage: {
      value: `${bodyFatPercentage.toFixed(1)}%`,
      description: 'Estimated body fat percentage using BMI method'
    }
  });
};

// Water Intake
exports.waterIntake = (req, res, next) => {
  const { weight, activityLevel } = req.query;

  // Check if required parameters are provided
  if (!weight || !activityLevel) {
    return next(
      new AppError(
        'Missing required parameters (weight or activityLevel).',
        400
      )
    );
  }

  // Convert weight to number
  const numericWeight = parseFloat(weight);

  // Check if the conversion was successful
  if (isNaN(numericWeight)) {
    return next(new AppError('Invalid numeric input for weight.', 400));
  }

  // Define activity level multipliers (adjust as needed)
  const activityMultipliers = {
    sedentary: 1.0,
    'lightly active': 1.3,
    'moderately active': 1.6,
    'very active': 1.8
  };

  // Check if the provided activity level is valid
  const selectedMultiplier = activityMultipliers[activityLevel.toLowerCase()];
  if (selectedMultiplier === undefined) {
    return next(new AppError('Invalid activity level.', 400));
  }

  // Calculate water intake based on body weight and activity level
  const waterIntake = numericWeight * selectedMultiplier * 0.033; // A common recommendation is 30-35 ml per kg of body weight

  res.json({
    waterIntake: {
      value: waterIntake.toFixed(2),
      unit: 'liters',
      description: `Estimated daily water intake based on body weight and activity level (${activityLevel})`
    }
  });
};

// BMI
exports.BMI2 = (req, res, next) => {
  // Get input parameters from req.query
  const { weight, height } = req.body;

  // Check if all required parameters are present
  if (!weight || !height) {
    return next(new AppError('Missing required parameters'), 400);
  }

  // Convert parameters to numbers
  const weightInKg = parseFloat(weight);
  const heightInM = parseFloat(height) / 100; // Convert height to meters

  // Check if conversion was successful
  if (isNaN(weightInKg) || isNaN(heightInM)) {
    return next(new AppError('Invalid input parameters'), 400);
  }

  // Calculate BMI
  const bmi = weightInKg / (heightInM * heightInM);

  // Determine weight status
  let weightStatus;
  if (bmi < 18.5) {
    weightStatus = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    weightStatus = 'Normal weight';
  } else if (bmi >= 25 && bmi < 29.9) {
    weightStatus = 'Overweight';
  } else {
    weightStatus = 'Obese';
  }

  return res.json({
    BMI: bmi.toFixed(1),
    weightStatus
  });
};

// BMR
exports.BMR2 = (req, res, next) => {
  const { age, gender, weight, height, activityLevel } = req.body;

  // Check if required parameters are provided
  if (!age || !gender || !weight || !height || !activityLevel) {
    return next(new AppError('Missing required parameters.', 400));
  }

  // Convert string inputs to numbers
  const numericAge = parseFloat(age);
  const numericWeight = parseFloat(weight);
  const numericHeight = parseFloat(height);

  // Check if the conversion was successful
  if (isNaN(numericAge) || isNaN(numericWeight) || isNaN(numericHeight)) {
    return next(new AppError('Invalid numeric input.', 400));
  }

  // BMR calculation
  let bmr;
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender.toLowerCase() === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    return next(
      new AppError('Invalid gender. Please use "male" or "female".', 400)
    );
  }

  // TDEE calculation based on activity level
  let tdee;
  switch (activityLevel.toLowerCase()) {
    case 'sedentary':
      tdee = bmr * 1.2;
      break;
    case 'lightly active':
      tdee = bmr * 1.375;
      break;
    case 'moderately active':
      tdee = bmr * 1.55;
      break;
    case 'very active':
      tdee = bmr * 1.725;
      break;
    case 'extra active':
      tdee = bmr * 1.9;
      break;
    default:
      return next(new AppError('Invalid activity level.', 400));
  }

  res.json({
    bmr: {
      value: bmr,
      description: 'Basal Metabolic Rate (BMR) in kcal'
    },
    tdee: {
      value: tdee,
      description:
        'Total Daily Energy Expenditure (TDEE) in kcal, including physical activity'
    }
  });
};

/* Body Fat male: { min: 18, max: 99 },
            female: { min: 18, max: 99 },
            boy: { min: 6, max: 17 },
            girl: { min: 6, max: 17 }
*/
exports.bodyFat2 = (req, res, next) => {
  const { gender, height, weight, age } = req.body;

  // Check if required parameters are provided
  if (!gender || !height || !weight || !age) {
    return next(new AppError('Missing required parameters.', 400));
  }

  // Convert string inputs to numbers
  const numericHeight = parseFloat(height);
  const numericWeight = parseFloat(weight);
  const numericAge = parseFloat(age);

  // Check if the conversion was successful
  if (isNaN(numericHeight) || isNaN(numericWeight) || isNaN(numericAge)) {
    return next(new AppError('Invalid numeric input.', 400));
  }

  // Calculate BMI
  const bmi = numericWeight / Math.pow(numericHeight / 100, 2);

  // Check age limits based on gender
  const ageLimits = {
    male: { min: 18, max: 99 },
    female: { min: 18, max: 99 },
    boy: { min: 6, max: 17 },
    girl: { min: 6, max: 17 }
  };

  if (
    numericAge < ageLimits[gender.toLowerCase()].min ||
    numericAge > ageLimits[gender.toLowerCase()].max
  ) {
    return next(new AppError(`Invalid age for ${gender}.`, 400));
  }

  // Use BMI to estimate body fat percentage
  let bodyFatPercentage;
  if (gender.toLowerCase() === 'male') {
    bodyFatPercentage = 1.2 * bmi + 0.23 * numericAge - 16.2;
  } else if (gender.toLowerCase() === 'female') {
    bodyFatPercentage = 1.2 * bmi + 0.23 * numericAge - 5.4;
  } else if (gender.toLowerCase() === 'boy') {
    bodyFatPercentage = 1.51 * bmi - 0.7 * numericAge - 2.2;
  } else if (gender.toLowerCase() === 'girl') {
    bodyFatPercentage = 1.51 * bmi - 0.7 * numericAge + 1.4;
  } else {
    return next(
      new AppError(
        'Invalid gender. Please use "male", "female", "boy", or "girl".',
        400
      )
    );
  }

  res.json({
    bodyFatPercentage: {
      value: `${bodyFatPercentage.toFixed(1)}%`,
      description: 'Estimated body fat percentage using BMI method'
    }
  });
};

// Water Intake
exports.waterIntake2 = (req, res, next) => {
  const { weight, activityLevel } = req.body;

  // Check if required parameters are provided
  if (!weight || !activityLevel) {
    return next(
      new AppError(
        'Missing required parameters (weight or activityLevel).',
        400
      )
    );
  }

  // Convert weight to number
  const numericWeight = parseFloat(weight);

  // Check if the conversion was successful
  if (isNaN(numericWeight)) {
    return next(new AppError('Invalid numeric input for weight.', 400));
  }

  // Define activity level multipliers (adjust as needed)
  const activityMultipliers = {
    sedentary: 1.0,
    'lightly active': 1.3,
    'moderately active': 1.6,
    'very active': 1.8
  };

  // Check if the provided activity level is valid
  const selectedMultiplier = activityMultipliers[activityLevel.toLowerCase()];
  if (selectedMultiplier === undefined) {
    return next(new AppError('Invalid activity level.', 400));
  }

  // Calculate water intake based on body weight and activity level
  const waterIntake = numericWeight * selectedMultiplier * 0.033; // A common recommendation is 30-35 ml per kg of body weight

  res.json({
    waterIntake: {
      value: waterIntake.toFixed(2),
      unit: 'liters',
      description: `Estimated daily water intake based on body weight and activity level (${activityLevel})`
    }
  });
};
