import Appointment from "../models/Appointment";
import * as Yup from "yup";
import User from "../models/User";
import { startOfHour, parseISO, isBefore } from "date-fns";
import File from "../models/file";

class AppointmentConroller {
  async index(req, res) {
    const { page = 1 } = req.query;

    const apponitments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      order: ["date"],
      attributes: ["id", "date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["id", "path", "url"]
            }
          ]
        }
      ]
    });

    return res.json(apponitments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: "Validations fails." });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if id_provider is user provider
     */

    const userIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!userIsProvider) {
      return res
        .status(401)
        .json("You can only create appointments with providers");
    }

    const hourStart = startOfHour(parseISO(date));

    /**
     * Check for past date
     */

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past dates are not permitted." });
    }

    /**
     * check date avaiability
     */

    const checkAvaiability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvaiability) {
      return res
        .status(400)
        .json({ error: "Date appointment is not avaiable." });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentConroller();
