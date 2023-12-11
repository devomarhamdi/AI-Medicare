const express = require('express');
const healthController = require('./../controllers/Patient/healthController');
const symptomController = require('../controllers/Patient/symptomController.js');
const authController = require('./../controllers/authController');

const router = express.Router();

// Health Calculators
router.get(
  '/bmi',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMI
);
router.get(
  '/bmr',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMR
);
router.get(
  '/bodyFat',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.bodyFat
);
router.get(
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
  symptomController.symptoms
);
router.get(
  '/diagnosis',
  authController.protect,
  authController.restrictTo('patient'),
  symptomController.diagnosis
);
router.get(
  '/issue',
  authController.protect,
  authController.restrictTo('patient'),
  symptomController.issue
);

module.exports = router;
