const axios = require('axios');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const getToken = async () => {
  try {
    const uri = 'https://authservice.priaid.ch/login';
    const apiKey = process.env.apiKey;
    const secretKey = process.env.secretKey;

    // Compute HMACMD5 hash
    const computedHash = CryptoJS.HmacMD5(uri, secretKey);
    const computedHashString = computedHash.toString(CryptoJS.enc.Base64);

    // Set up authorization header
    const authorizationHeader = `Bearer ${apiKey}:${computedHashString}`;

    // Make the request using Axios
    const response = await axios.post(
      uri,
      {},
      {
        headers: {
          Authorization: authorizationHeader
        }
      }
    );

    // Return the token from the response
    const finalToken = response.data.Token;
    return finalToken;
  } catch (error) {
    // Throw error if there is a problem
    throw new Error(error);
  }
};

module.exports = getToken;
