import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'

import { db } from './config/db.js'
import servicesRoutes from './routes/servicesRoutes.js'
import authRoutes from './routes/authRoutes.js'

// Cargar variables de entorno
dotenv.config()

// Configuración de app
const app = express()

// Leer datos del body
app.use(express.json())

// Conectar a BD
db()

// Configuración de CORS
const whitelist = [process.env.FRONTEND_URL, undefined]

const corsOptions = {
  /* Origin es una función que recibe el origen y un callback como parámetros
    en la cual validaremos si el origen que quiere acceder a los recursos podrá
    conectarse o no */
  origin: function(origin, callback) {
    if (whitelist.includes(origin)) {
      // Se permite la conexión
      callback(null, true)
    } else {
      // NO se permite la conexión
      callback(new Error(`Error de CORS (Origen: ${origin})`))
    }
  }
}

app.use(cors(corsOptions))

// Definición de rutas
/* Podemos utilizar el middleware use de express para asignar un conjunto de
  rutas de un módulo a una ruta común */
app.use('/api/v1/services', servicesRoutes)
app.use('/api/v1/auth', authRoutes)

// Definición del puerto
const PORT = process.env.PORT || 8000

// Arranque de la app
app.listen(PORT, () => {
  console.log(colors.blue('Servidor ejecutándose en el puerto:', colors.bold(PORT)))
})