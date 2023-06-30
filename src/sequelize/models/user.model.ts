import { DataTypes, Model, Sequelize } from 'sequelize';
import { User, NewUser } from '../../types/user.type';

class UserModel extends Model<User, NewUser> {
  declare id: string;
  declare username: string;
  declare name: string;
  declare hashedPassword: string;
}

export const userModelInit = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      hashedPassword: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      underscored: true,
      timestamps: false,
      modelName: 'User',
    }
  );
  return UserModel;
};

export default UserModel;
