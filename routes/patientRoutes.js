const express = require('express');
const healthController = require('./../controllers/Patient/healthController');
const symptomController = require('../controllers/Patient/symptomController.js');
const authController = require('./../controllers/authController');
const symptomToken = require('../utils/symptomToken.js');

const router = express.Router();

// Health Calculators
router.post(
  '/bmi',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMI
);
router.post(
  '/bmr',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMR
);
router.post(
  '/bodyFat',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.bodyFat
);
router.post(
  '/waterIntake',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.waterIntake
);

// Symptoms Checker
router.get(
  '/symptoms',
  authController.protect,
  authController.restrictTo('patient'),
  symptomToken.getToken,
  symptomController.symptoms
);
router.get(
  '/diagnosis',
  authController.protect,
  authController.restrictTo('patient'),
  symptomToken.getToken,
  symptomController.diagnosis
);
router.get(
  '/issue',
  authController.protect,
  authController.restrictTo('patient'),
  symptomToken.getToken,
  symptomController.issue
);

module.exports = router;
