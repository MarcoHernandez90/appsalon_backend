import Appointment from "../models/Appointment.js"

const getUserAppointments = async (req, res) => {
  const today = new Date()
  const { user } = req.params

  if (user !== req.user._id.toString()) {
    const error = new Error("Acceso denegado")
    res.status(400).json({ msg: error.message })
  }

  try {
    const query = req.user.admin
      ? {
          date: { $gte: today },
        }
      : {
          user,
          date: { $gte: today },
        }
    const appointments = await Appointment.find(query)
      .populate("services")
      .populate({ path: "user", select: "name email" })
      .sort({ date: "desc" })
    res.json(appointments)
  } catch (error) {
    console.log(error)
  }
}

export { getUserAppointments }
