const express = require('express');
const healthController = require('./../controllers/Patient/healthController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(
  '/bmi',
  authController.protect,
  authController.restrictTo('patient'),
  healthController.BMI
);

module.exports = router;
