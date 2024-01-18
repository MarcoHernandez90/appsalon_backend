import Services from "../models/Service.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const createService = async (req, res) => {
  /* En caso de que el json recibido contenga valores vacíos, se devuelve
    una respuesta de status 400 con un mensaje */
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios")
    return res.status(400).json({
      msg: error.message
    })
  }

  try {
    /* Creamos una instancia del modelo Services para guardar la información en
      la base de datos */
    const service = new Services(req.body)
    const result = await service.save()
    return res.json({
      msg: "El servicio se creó correctamente",
    })
  } catch (error) {
    return res.status(400).json({
      msg: error.message
    })
  }
}

const getServices = async (req, res) => {
  // Se puede utilizar res.json para forzar una respuesta de tipo JSON
  // res.json(services)
  // O se puede utilizar res.send para mandar una respuesta de cualquier tipo
  // res.send(products)

  try {
    const services = await Services.find()
    res.json(services)
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    })
  }
}

const getServiceById = async (req, res) => {
  const { id } = req.params

  if (validateObjectId(id, res)) return

  // Validar que exista
  const service = await Services.findById(id)
  if (!service) {
    return handleNotFoundError("El servicio no existe", res)
  }

  // Mostrar el servicio
  return res.json(service)
}

const updateService = async (req, res) => {
  const { id } = req.params

  if (validateObjectId(id, res)) return

  // Validar que exista
  const service = await Services.findById(id)
  if (!service) {
    return handleNotFoundError("El servicio no existe", res)
  }

  // Escribimos en el objeto los valores nuevos
  service.name = req.body.name || service.name
  service.price = req.body.price || service.price

  try {
    await service.save()
    return res.json({
      msg: 'El servicio se actualizó correctamente'
    })
  } catch (error) {
    return res.status(400).json({
      msg: error.message
    })
  }
}

const deleteService = async (req, res) => {
  const { id } = req.params

  if (validateObjectId(id, res)) return

  const service = await Services.findById(id)
  if (!service) {
    return handleNotFoundError("El servicio no existe", res)
  }

  try {
    await service.deleteOne()
    return res.json({
      msg: "El servicio se eliminó correctamente"
    })
  } catch (error) {
    return res.status(400).json({
      msg: error.message
    })
  }
}

export { createService, getServices, getServiceById, updateService, deleteService }