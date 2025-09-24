import nodemailer from "nodemailer";

export async function sendExpenseAlert(
  to: string,
  amount: number,
  description: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // 587 = STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Finance App" <${process.env.SMTP_USER}>`,
      to,
      subject: `High expense alert: ${amount} €`,
      text: `Pridaný výdavok ${amount} €\nPopis: ${description}`,
      html: `<h2>Nový vysoký výdavok</h2>
             <p><b>Suma:</b> ${amount} €</p>
             <p><b>Popis:</b> ${description}</p>`,
    });
    console.log("✅ E-mail odoslaný na:", to);
  } catch (err) {
    console.error("❌ Chyba pri posielaní e-mailu:", err);
  }
}
