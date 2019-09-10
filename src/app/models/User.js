import Sequelize, { Model } from "sequelize";
import bcripty from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );

    this.addHook("beforeSave", async user => {
      user.password_hash = await bcripty.hash(user.password, 8);
    });
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: "avatar_id", as: "avatar" });
  }

  checkPassword(password) {
    return bcripty.compare(password, this.password_hash);
  }
}

export default User;
