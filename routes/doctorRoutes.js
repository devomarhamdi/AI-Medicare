const express = require('express');
const authController = require('../controllers/authController');
const modelController = require('../controllers/Doctor/modelsController');

const router = express.Router();

//Models
router.post(
  '/breast',
  authController.protect,
  authController.restrictTo('doctor'),
  modelController.breast
);

module.exports = router;
