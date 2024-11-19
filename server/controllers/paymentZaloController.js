const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');

// ZaloPay configuration
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

exports.createPayment = async (embedDataUrl, amount = 50000) => {
  const transID = Math.floor(Math.random() * 1000000);
  const embed_data = {
    redirecturl: embedDataUrl, 
  };

  const items = [];
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, 
    app_user: 'user123',
    app_time: Date.now(), // Time in milliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    callback_url: 'https://your-public-ngrok-url/callback',
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: '',
  };

  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    return result.data;
  } catch (error) {
    console.error('Error in createPayment:', error.message);
    throw error;
  }
};

exports.handleCallback = (req, res) => {
  let result = {};
  try {
    const { data: dataStr, mac: reqMac } = req.body;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = 'MAC verification failed';
    } else {
      const dataJson = JSON.parse(dataStr);
      console.log(`Order success. Transaction ID: ${dataJson.app_trans_id}`);
      result.return_code = 1;
      result.return_message = 'Success';
    }
  } catch (error) {
    console.error('Error in handleCallback:', error.message);
    result.return_code = 0; 
    result.return_message = error.message;
  }

  res.json(result);
};

exports.checkTransactionStatus = async (app_trans_id) => {
  const postData = {
    app_id: config.app_id,
    app_trans_id,
  };

  const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const postConfig = {
    method: 'post',
    url: 'https://sb-openapi.zalopay.vn/v2/query',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return result.data;
  } catch (error) {
    console.error('Error in checkTransactionStatus:', error.message);
    throw error;
  }
};
