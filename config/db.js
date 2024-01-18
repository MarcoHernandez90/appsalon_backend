import mongoose from "mongoose"
import colors from 'colors'

export const db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI)
    const url = `${db.connection.host}:${db.connection.port}`
    console.log(colors.green("Conectado a la BD de MongoDB:"), colors.cyan(url))
  } catch (error) {
    console.log("🚀 ~ file: db.js:7 ~ db ~ error:", error)
    // Finalizamos la aplicación si no se conecta a la bd
    process.exit(1)
  }
}