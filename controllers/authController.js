import User from '../models/User.js'
import { sendEmailPasswordReset, sendEmailVerification } from '../emails/authEmailService.js'
import { generateJWT, uniqueID } from '../utils/index.js'

const register = async (req, res) => {
  // Valida todos los campos
  if ( Object.values(req.body).includes('') ){
    const error = new Error('Todos los campos son obligatorios')

    return res.status(400).json({
      msg: error.message
    })
  }

  const { email, name, password } = req.body
  // Evitar registros duplicados
  const userExists = await User.findOne({ email })
  if (userExists) {
    const error = new Error("Ya existe un usuario con ese email")

    return res.status(400).json({
      msg: error.message,
    })
  }

  // Validar longitud de password
  const MIN_PASSWORD_LENGTH = 8
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(`La contraseña debe tener una longitud mínima de $  {MIN_PASSWORD_LENGTH} caracteres`)

    return res.status(400).json({
      msg: error.message,
    })
  }

  try {
    const user = new User(req.body)
    const result = await user.save()

    const { name, email, token } = result
    sendEmailVerification({ name, email, token })

    res.json({
      msg: 'Usuario creado correctamente. Revisa tu correo electrónico.'
    })
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    })
  }
}

const verifyAccount = async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({ token })

  if (!user) {
    const error = new Error('Hubo un error, token no válido.')

    return res.status(401).json({ msg: error.message })
  }

  // Si el token es válido, confirmar la cuenta
  try {
    user.verified = true
    user.token = null
    await user.save()

    res.json({ msg: 'Usuario confirmado' })
  } catch (error) {
    console.log(error)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  // Revisar si el usuario existe
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error("El usuario no existe.")

    return res.status(401).json({ msg: error.message })
  }

  // Revisar si confirmó la cuenta
  if (!user.verified) {
    const error = new Error("Esta cuenta no ha sido confirmada.")

    return res.status(401).json({ msg: error.message })
  }

  // Comprobar el password
  if (await user.checkPassword(password)) {
    const token = generateJWT(user._id)

    res.json({ token })
  } else {
    const error = new Error("Contraseña incorrecta.")

    return res.status(401).json({ msg: error.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    const error = new Error("El usuario no existe")

    return res.status(404).json({ msg: error.message })
  }

  try {
    user.token = uniqueID()
    const result = await user.save()
    await sendEmailPasswordReset({ name: result.name, email: result.email, token: result.token })

    res.json({
      msg: 'Te hemos enviado un email con las instrucciones'
    })
  } catch (error) {
    console.log(error)
  }
}

const verifyPasswordReset = async (req, res) => {
  const { token } = req.params
  console.log(token)

  const isValidToken = await User.findOne({ token })
  if (!isValidToken) {
    const error = new Error('Hubo un error: Token no válido')
    return res.status(400).json({ msg: error.message })
  }

  res.json({ msg: 'Token válido' })
}

const updatePassword = async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({ token })
  if (!user) {
    const error = new Error("Hubo un error: Token no válido")
    return res.status(400).json({ msg: error.message })
  }

  const { password } = req.body

  try {
    user.token = ''
    user.password = password
    await user.save()
    res.json({
      msg: 'Contraseña cambiada correctamente'
    })
  } catch (error) {
    console.log(error)
  }
}

const user = async (req, res) => {
  const { user } = req
  res.json(user)
}

const admin = async (req, res) => {
  const { user } = req

  if (!user.admin) {
    const error = new Error('Acción no válida')
    return res.status(403).json({ msg: error.message })
  }

  res.json(user)
}

export {
  register,
  verifyAccount,
  login,
  forgotPassword,
  verifyPasswordReset,
  updatePassword,
  user,
  admin
}