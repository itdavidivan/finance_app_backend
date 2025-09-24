import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY!;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendExpenseAlert(
  to: string,
  amount: number,
  description: string
) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: { name: "Finance App", email: process.env.FROM_EMAIL },
    to: [{ email: to }],
    subject: `High expense alert: ${amount} €`,
    htmlContent: `<h2>Nový vysoký výdavok</h2>
                  <p><b>Suma:</b> ${amount} €</p>
                  <p><b>Popis:</b> ${description}</p>`,
    textContent: `Pridaný výdavok ${amount} €\nPopis: ${description}`,
  });

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ E-mail odoslaný na:", to, "ID:", data.messageId);
  } catch (err) {
    console.error("❌ Chyba pri posielaní e-mailu:", err);
  }
}
