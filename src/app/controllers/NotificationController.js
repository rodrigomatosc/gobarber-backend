import Notification from "../schemas/Notification";

class NotificationController {
  async index(req, res) {
    const userIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!userIsProvider) {
      return res.status(401).json("Only providers can load notification");
    }

    const notificattions = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.json(notificattions);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
