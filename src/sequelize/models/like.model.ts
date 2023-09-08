import { CreationOptional, DataTypes, ForeignKey, Model, Sequelize } from 'sequelize';
import { BlogAttributes } from '../../types/blog.type';
import { LikeAttributes, LikeCreation } from '../../types/like.type';
import { UserAttributes } from '../../types/user.type';

class Like extends Model<LikeAttributes, LikeCreation> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<UserAttributes['id']>;
  declare blogId: ForeignKey<BlogAttributes['id']>;
}

export type LikeOrNothing = Like | null | undefined;

export const likesInit = (sequelize: Sequelize) => {
  Like.init(
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
    },
    {
      sequelize,
      modelName: 'like',
      timestamps: false,
      underscored: true,
    },
  );

  return Like;
};

export default Like;
