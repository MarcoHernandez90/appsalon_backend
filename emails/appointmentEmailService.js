import { createTransport } from '../config/nodemailer.js'

export async function sendNewAppointmentEmail({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  )

  const info = await transporter.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: "admin@correo.com",
    subject: "AppSalon - Nueva Cita",
    text: "AppSalon - Nueva Cita",
    html: `<p>Hola: Admin, tienes una nueva cita</p>
      <p>La cita será el día: ${date} a las ${time} horas.</p>
    `,
  })
}

export async function sendUpdateAppointmentEmail({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  )

  const info = await transporter.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: "admin@correo.com",
    subject: "AppSalon - Cita Actualizada",
    text: "AppSalon - Cita Actualizada",
    html: `<p>Hola: Admin, un usuario modificó su cita</p>
      <p>La cita será el día: ${date} a las ${time} horas.</p>
    `,
  })
}

export async function sendDeletedAppointmentEmail({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  )

  const info = await transporter.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: "admin@correo.com",
    subject: "AppSalon - Cita Cancelada",
    text: "AppSalon - Cita Cancelada",
    html: `<p>Hola: Admin, un usuario canceló su cita</p>
      <p>La cita estaba programada para el día: ${date} a las ${time} horas.</p>
    `,
  })
}