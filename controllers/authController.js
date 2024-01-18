import User from '../models/User.js'

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
  console.log(password.length)
  console.log(password.trim().length)
  const MIN_PASSWORD_LENGTH = 8
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(`La contraseña debe tener una longitud mínima de ${MIN_PASSWORD_LENGTH} caracteres`)

    return res.status(400).json({
      msg: error.message,
    })
  }

  try {
    const user = new User(req.body)
    await user.save()
    res.json({
      ms: 'Usuario creado correctamente. Revisa tu correo electrónico.'
    })
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    })
  }
}

export {
  register
}