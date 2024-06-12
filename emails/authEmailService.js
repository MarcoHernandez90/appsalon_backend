import { createTransport } from "../config/nodemailer.js"

export async function sendEmailVerification({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD,
  )

  const info = await transporter.sendMail({
    from: "AppSalon <cuentas@appsalon.com>",
    to: email,
    subject: "AppSalon - Confirma tu cuenta",
    text: "AppSalon - Confirma tu cuenta",
    html: `<p>Hola: ${name}, confirma tu cuenta en AppSalon</p>
    <p>Tu cuenta está casi lista, sólo debes confirmarla en el siguiente enlace</p>
    <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}/">Confirmar cuenta</a>
    <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
    `
  })
}

export async function sendEmailPasswordReset({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  )

  const info = await transporter.sendMail({
    from: "AppSalon <cuentas@appsalon.com>",
    to: email,
    subject: "AppSalon - Reestablece tu contraseña",
    text: "AppSalon - Reestablece tu contraseña",
    html: `<p>Hola: ${name}, has solicitado reestablecer tu contraseña</p>
    <p>Sigue el siguiente enlace para generar una nueva contraseña:</p>
    <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}/">Reestablecer contraseña</a>
    <p>Si no solicitaste el reestablecimiento de tu contraseña, puedes ignorar este mensaje</p>
    `,
  })
}