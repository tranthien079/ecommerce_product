const axios = require('axios');
const crypto = require('crypto');
const config = require('../utils/config');
const createPaymentMomo = async (totalPrice,req, res) => {
  const {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  const amount = totalPrice;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;

  // Generate raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Create signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  // Create request body
  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error.message;
  }
};


const checkTransactionStatusMomo = async ({orderId}, req, res) => {

  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const accessKey = 'F8BBA842ECF85';
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: 'MOMO',
    requestId: orderId,
    orderId,
    signature,
    lang: 'vi',
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error.message;
  }
};


const handleCallbackMomo = async (req, res) => {
  console.log('Callback received:', req.body);
  // Update order status based on the response
  return res.status(204).json(req.body);
};
module.exports = { createPaymentMomo, handleCallbackMomo, checkTransactionStatusMomo };