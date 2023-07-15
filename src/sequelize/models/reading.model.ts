import { CreationOptional, DataTypes, ForeignKey, Model, Sequelize } from 'sequelize';
import { ReadingAttributes, ReadingCreation } from '../../types/reading.type';
import { UserAttributes } from '../../types/user.type';
import { BlogAttributes } from '../../types/blog.type';

class Reading extends Model<ReadingAttributes, ReadingCreation> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<UserAttributes['id']>;
  declare blogId: ForeignKey<BlogAttributes['id']>;
  declare read: boolean;
}

export const readingInit = (sequelize: Sequelize) => {
  Reading.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blogs',
          key: 'id',
        },
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'reading',
      timestamps: false,
      underscored: true,
    }
  );

  return Reading;
};

export default Reading;
