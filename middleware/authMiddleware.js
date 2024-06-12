import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const authMiddleware = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      /* Obtenemos el usuario en base al id que viene en el token y, con el método select, indicamos que no queremos obtener la contraseña */
      req.user = await User.findById(decoded.id).select("-password -verified -token -__v")

      next()
    } catch {
      const error = new Error('Token no válido o inexistente')
      res.status(410).json({ msg: error.message })
    }
  } else {
    const error = new Error('Token no válido o inexistente')
    res.status(410).json({ msg: error.message })
  }
}

export default authMiddleware