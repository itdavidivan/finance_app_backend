import nodemailer from "nodemailer";

export async function sendExpenseAlert(
  to: string,
  amount: number,
  description: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // pre 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Finance App" <${process.env.SMTP_USER}>`,
    to,
    subject: `High expense alert: ${amount} €`,
    text: `Práve bol pridaný výdavok ${amount} €.\nPopis: ${description}`,
    html: `<h2>Nový vysoký výdavok</h2>
           <p><b>Suma:</b> ${amount} €</p>
           <p><b>Popis:</b> ${description}</p>`,
  });
}
