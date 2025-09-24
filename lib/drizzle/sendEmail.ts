import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: "apikey", // Sendinblue vyžaduje user = "apikey"
    pass: process.env.SENDINBLUE_API_KEY!,
  },
});

export async function sendExpenseAlert(
  to: string,
  amount: number,
  description: string
) {
  try {
    await transporter.sendMail({
      from: `"Finance App" <it.davidivan@gmail.com>`, // môžeš zmeniť, ale musíš overiť v Sendinblue
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
