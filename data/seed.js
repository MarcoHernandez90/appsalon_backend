import dotenv from "dotenv"
import colors from "colors"
import { db } from "../config/db.js"
import Services from "../models/Service.js"
import { services } from "./beautyServices.js"

dotenv.config()

await db()

async function seedDB() {
  console.log("")
  try {
    await Services.insertMany(services)
    console.log(colors.green.bold("Servicios agregados correctamente"))
    process.exit()
  } catch (error) {
    console.log(colors.red.bold(error.message))
    process.exit(1)
  }
}

async function clearDB() {
  console.log("")
  try {
    await Services.deleteMany()
    console.log(
      colors.green.bold("Servicios"),
      colors.red.bold("eliminados"),
      colors.green.bold("correctamente")
    )
    process.exit()
  } catch (error) {
    console.log(colors.red.bold(error.message))
    process.exit(1)
  }
}

if (process.argv[2] == "--import") {
  seedDB()
} else {
  clearDB()
}
