const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendResetPasswordEmail = async (userEmail, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Colocar tu email en variables de entorno
      pass: process.env.EMAIL_PASSWORD // Colocar tu password en variables de entorno
    }
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: 'myshop@example.com',
    to: userEmail,
    subject: 'Reset Your Password',
    html: `<p>Click the link below to reset your password. This link will expire in 1 hour.</p>
           <a href="${resetLink}">Reset Password</a>`
  };

  await transporter.sendMail(mailOptions);
};

const generatePasswordResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  sendResetPasswordEmail,
  generatePasswordResetToken
};
