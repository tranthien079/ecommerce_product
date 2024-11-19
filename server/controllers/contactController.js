const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMailContact = asyncHandler(async (req, res) => {
    const { email, name, phone, message} = req.body;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        },
    });

    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `${name}`, 
            to: process.env.MAIL_ID, 
            subject: `Khách hàng ${name} liên hệ`,
            text: 'Bạn có liên hệ mới', 
            html: `
            <p>Bạn có một liên hệ mới:</p>
             <ul>
               <li><strong>Họ và tên:</strong> ${name}</li>
               <li><strong>Email:</strong> ${email}</li>
               <li><strong>Điện thoại:</strong> ${phone}</li>
               <li><strong>Lời nhắn:</strong> ${message}</li>
             </ul>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return res.json({success:info.messageId})
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error('Failed to send email');
    }
});



module.exports = sendMailContact;
