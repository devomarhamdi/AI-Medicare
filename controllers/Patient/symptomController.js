const AppError = require('../../utils/appError');
const axios = require('axios');
const getToken = require('../../utils/symptomToken');

// Constants for API parameters
// let API_TOKEN;
// getToken().then(value => (API_TOKEN = value));
const FORMAT = 'json';
const LANGUAGE = 'en-gb';

// Construct the API URL with embedded parameters
const HEALTH_SERVICE_API_URL = (endpoint, API_TOKEN) => {
  const url = `https://healthservice.priaid.ch/${endpoint}?token=${API_TOKEN}&format=${FORMAT}&language=${LANGUAGE}`;
  // console.log(url);
  return url;
};
// Get all symptoms
exports.symptoms = async (req, res, next) => {
  const API = req.symptomToken;
  // console.log(API);
  try {
    // Make a request to the health service API using fetch
    const response = await axios.get(HEALTH_SERVICE_API_URL('symptoms', API));
    // Check for errors in the health service API response
    if (response.data.error) {
      return next(
        new AppError(response.data.error.message, response.data.error.code)
      );
    }
    // Extract symptoms data from the response
    const symptoms = response.data;

    res.json({
      status: 'success',
      results: symptoms.length,
      symptoms
    });
  } catch (error) {
    // console.log(error);
    if (error.cause instanceof AggregateError) {
      // Handle AggregateError
      // console.error('Multiple errors occurred:');
      for (const individualError of error.errors) {
        // console.error(individualError);
      }
      next(new AppError('Multiple errors occurred', 500));
    } else {
      // Handle other errors
      next(new AppError(error, 500));
    }
  }
};

// Get the diagnosis
exports.diagnosis = async (req, res, next) => {
  const API = req.symptomToken;
  try {
    const symptoms = req.query.symptoms;
    const gender = req.query.gender;
    const yearOfBirth = req.query.year_of_birth;

    // Validate required parameters
    if (!symptoms || !gender || !yearOfBirth) {
      return next(
        new AppError('Symptoms, gender, and year_of_birth are required.', 400)
      );
    }

    // Make a request to the health service API
    const response = await axios.get(HEALTH_SERVICE_API_URL('diagnosis', API), {
      params: {
        symptoms,
        gender,
        year_of_birth: yearOfBirth
      }
    });

    // Check for errors in the health service API response
    if (response.data.error) {
      return next(new AppError(response.data, response.status));
    }

    const diagnosis = response.data;

    // Send the response from the health service API to the client
    res.json({
      status: 'success',
      results: diagnosis.length,
      diagnosis
    });
  } catch (error) {
    // Handle other errors and pass them to the global error handler
    return next(new AppError(error.response.data, 500));
  }
};

// Get the issue
exports.issue = async (req, res, next) => {
  const API_TOKEN = req.symptomToken;
  try {
    const issueId = req.query.issueId;

    // Validate required parameters
    if (!issueId) {
      return next(new AppError('issue id is required.', 400));
    }

    // Make a request to the health service API
    const response = await axios.get(
      `https://healthservice.priaid.ch/issues/${issueId}/info?token=${API_TOKEN}&format=${FORMAT}&language=${LANGUAGE}`
    );

    // Check for errors in the health service API response
    if (response.data.error) {
      return next(new AppError(response.data, response.status));
    }

    const issue = response.data;

    // Send the response from the health service API to the client
    res.json({
      status: 'success',
      issue
    });
  } catch (error) {
    // Handle other errors and pass them to the global error handler
    return next(new AppError(error.response.data, 500));
  }
};

// Get the diagnosis
exports.diagnosis2 = async (req, res, next) => {
  const API = req.symptomToken;
  try {
    const symptoms = req.body.symptoms;
    const gender = req.body.gender;
    const yearOfBirth = req.body.year_of_birth;

    // Validate required parameters
    if (!symptoms || !gender || !yearOfBirth) {
      return next(
        new AppError('Symptoms, gender, and year_of_birth are required.', 400)
      );
    }

    // Make a request to the health service API
    const response = await axios.get(HEALTH_SERVICE_API_URL('diagnosis', API), {
      params: {
        symptoms,
        gender,
        year_of_birth: yearOfBirth
      }
    });

    // Check for errors in the health service API response
    if (response.data.error) {
      return next(new AppError(response.data, response.status));
    }

    const diagnosis = response.data;

    // Send the response from the health service API to the client
    res.json({
      status: 'success',
      results: diagnosis.length,
      diagnosis
    });
  } catch (error) {
    // Handle other errors and pass them to the global error handler
    return next(new AppError(error.response.data, 500));
  }
};

// Get the issue
exports.issue2 = async (req, res, next) => {
  const API_TOKEN = req.symptomToken;
  try {
    const issueId = req.body.issueId;

    // Validate required parameters
    if (!issueId) {
      return next(new AppError('issue id is required.', 400));
    }

    // Make a request to the health service API
    const response = await axios.get(
      `https://healthservice.priaid.ch/issues/${issueId}/info?token=${API_TOKEN}&format=${FORMAT}&language=${LANGUAGE}`
    );

    // Check for errors in the health service API response
    if (response.data.error) {
      return next(new AppError(response.data, response.status));
    }

    const issue = response.data;

    // Send the response from the health service API to the client
    res.json({
      status: 'success',
      issue
    });
  } catch (error) {
    // Handle other errors and pass them to the global error handler
    return next(new AppError(error.response.data, 500));
  }
};
