import express from "express"
import { createService, getServiceById, getServices, updateService, deleteService } from "../controllers/servicesController.js"

const router = express.Router()

/* Definimos rutas mandándo a llamar el método que necesitamos en la app
  (get, post, put, delete) con la ruta y un callback como parámetros.
  En el callback se reciben los parámetros de req (request), res (response) y
  next (un objeto de router para redirigir la petición). */

// Esto se puede hacer definiendo rutas y métodos por separado:
router.get("/", getServices)
router.post("/", createService)

// O agrupando varios métodos para una misma ruta:
router.route("/:id")
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService)

export default router