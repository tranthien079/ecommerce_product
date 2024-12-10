const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendOrderConfirmationMail = asyncHandler(async (pendingOrder) => {
  // Validate input
  if (!pendingOrder) {
    throw new Error("Order information is required");
  }

  // Validate email recipient
  const recipientEmail = pendingOrder?.userId?.email;
  if (!recipientEmail) {
    throw new Error("No recipient email address found");
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  try {
    // Create HTML template
    const htmlTemplate = `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
        <header style="background-color: #ee2737; color: white; padding: 1em;">
          <img 
            src="https://i.imgur.com/XqiRDy4.jpg" 
            alt="Shop Logo" 
            style="max-width: 200px;"
          />
          <div style="text-align: right;">
            <div>${new Date(pendingOrder?.createdAt).toLocaleString()}</div>
            <div>Mã đơn hàng: ${pendingOrder?._id}</div>
          </div>
        </header>

        <section style="padding: 1em;">
          <h2>Xin chào ${pendingOrder?.userId?.firstname} ${
      pendingOrder?.userId?.lastname
    },</h2>
          <p>Cảm ơn bạn đã mua hàng của chúng tôi!</p>

          <h3>Chi tiết đơn hàng</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${pendingOrder?.orderItems
              ?.map(
                (item) => `
              <tr>
                <td>${item?.quantity} x ${item?.productId?.name}</td>
                <td>${item?.size}/${item?.color}</td>
                <td style="text-align: right;">${item?.productId?.discountPrice  >0 ? item?.productId?.discountPrice : item?.productId?.price} đ</td>
              </tr>
            `
              )
              .join("")}
            <tr>
              <td>Phí giao hàng</td>
              <td></td>
              <td style="text-align: right;">${
                pendingOrder?.typeDelivery?.price
              } đ</td>
            </tr>
            <tr>
            <td>Mã giảm giá</td>
            <td>
            <td style="text-align: right;">${
              pendingOrder?.couponId
                ? -(
                  pendingOrder?.couponId?.discount
                  ).toFixed(2) +'%'
                : `0đ`}</td>
          </tr>
            <tr>
              <td><strong>Tổng thanh toán</strong></td>
              <td></td>
              <td style="text-align: right;"><strong>${
                pendingOrder?.totalPrice
              } đ</strong></td>
            </tr>
          </table>

          <h3>Thông tin giao hàng</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>Người nhận:</td>
              <td style="text-align: right;">
                ${pendingOrder?.shippingInfo?.firstname} ${
      pendingOrder?.shippingInfo?.lastname
    }
              </td>
            </tr>
            <tr>
              <td>Số điện thoại:</td>
              <td style="text-align: right;">${
                pendingOrder?.shippingInfo?.mobile
              }</td>
            </tr>
            <tr>
              <td>Địa chỉ:</td>
              <td style="text-align: right;">${
                pendingOrder?.shippingInfo?.address
              }</td>
            </tr>
            <tr>
              <td>Hình thức thanh toán:</td>
              <td style="text-align: right;">${pendingOrder?.paymentInfo}</td>
            </tr>
            <tr>
            <td>Trạng thái thanh toán:</td>
            <td style="text-align: right;">Đã thanh toán</td>
          </tr>
          </table>
        </section>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: '"Shop STS" <noreply@example.com>',
      to: recipientEmail,
      subject: `Thanh toán thành công đơn hàng #${pendingOrder?._id}`,
      html: htmlTemplate,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent: %s", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error(
      `Failed to send order confirmation email: ${error.message}`
    );
  }
});

module.exports = sendOrderConfirmationMail;
