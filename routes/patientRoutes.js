const express = require('express');
const healthController = require('./../controllers/Patient/healthController');
const symptomController = require('../controllers/Patient/symptomController.js');
const authController = require('./../controllers/authController');
const symptomToken = require('../utils/symptomToken.js');

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
router.post(
  '/bmi',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMI2
);
router.post(
  '/bmr',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMR2
);
router.post(
  '/bodyFat',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.bodyFat2
);
router.post(
  '/waterIntake',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.waterIntake2
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
router.post(
  '/diagnosis',
  authController.protect,
  authController.restrictTo('patient'),
  symptomToken.getToken,
  symptomController.diagnosis2
);
router.post(
  '/issue',
  authController.protect,
  authController.restrictTo('patient'),
  symptomToken.getToken,
  symptomController.issue2
);

module.exports = router;
