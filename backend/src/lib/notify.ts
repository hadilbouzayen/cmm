/**
 * Lead notification. Spec §10 (Essentielle): form submissions must trigger an
 * e-mail notification to the centre.
 *
 * To keep the app runnable without SMTP credentials, this logs the notification
 * and is a single seam to wire real e-mail (e.g. nodemailer) later. Set
 * NOTIFY_EMAIL in .env to the receiving address (spec §11: "Choisir l'e-mail de
 * réception"). When SMTP_* vars are provided, replace the body of sendMail.
 */
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "createur.center@gmail.com";

export async function notifyNewLead(kind: "contact" | "inscription", payload: Record<string, unknown>) {
  const lines = Object.entries(payload)
    .filter(([k]) => k !== "consent" && k !== "website")
    .map(([k, v]) => `  ${k}: ${v ?? "—"}`)
    .join("\n");
  // TODO: replace with nodemailer transport when SMTP_HOST/SMTP_USER/SMTP_PASS are set.
  console.log(
    `\n[NOTIFY → ${NOTIFY_EMAIL}] Nouvelle demande (${kind})\n${lines}\n`
  );
}
