const PayOS = require('@payos/node');

const payos = new PayOS(
  'f7f2ca16-4f64-4d06-af35-3c3e37e20aee',
  'e16492ed-0210-483d-b200-ad676760856c',
  '2d81cbcb98288ca61797b98d6e5aeb40aa538d77ca4332d46a1f8224a3d5e68c'
);

const paymentPayOs = async (totalPrice, req, res) => {
  try {
    const orderCode = Math.floor(Math.random() * 1000000); 

    const order = {
      amount: totalPrice, // số tiền cần thanh toán
      description: "Thanh toan payOS" // mô tả đơn hàng
      orderCode, // mã đơn hàng (ensure it's unique)
      returnUrl: `${process.env.CLIENT_URL}/payment-success`, 
      cancelUrl: `${process.env.CLIENT_URL}/checkout`,
    };

    // Tạo link thanh toán
    const paymentLink = await payos.createPaymentLink(order);

    return paymentLink;  
  } catch (error) {
    console.error('Error creating payment link:', error);
  }
};

module.exports = {
  paymentPayOs,
};
