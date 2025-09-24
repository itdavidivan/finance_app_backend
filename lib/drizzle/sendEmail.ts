import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // false pre port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendExpenseAlert(
  to: string,
  amount: number,
  description: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Finance App" <${process.env.FROM_EMAIL}>`,
      to,
      subject: `Nový výdavok: ${amount} €`,
      text: `Pridaný výdavok ${amount} €\nPopis: ${description}`,
      html: `<h2>Nový výdavok</h2><p><b>Suma:</b> ${amount} €</p><p><b>Popis:</b> ${description}</p>`,
    });

    console.log("✅ E-mail odoslaný:", info.messageId);
  } catch (err) {
    console.error("❌ Chyba pri posielaní e-mailu:", err);
  }
}
