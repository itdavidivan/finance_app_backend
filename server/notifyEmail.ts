import nodemailer from "nodemailer";

export async function sendExpenseEmail(
  amount: number,
  description: string,
  toEmail: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // tvoj Gmail
      pass: process.env.EMAIL_PASSWORD, // App password
    },
  });

  await transporter.sendMail({
    from: `"Finance App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Nový veľký výdavok",
    text: `Bol pridaný výdavok ${amount} € – ${description}`,
  });
}
