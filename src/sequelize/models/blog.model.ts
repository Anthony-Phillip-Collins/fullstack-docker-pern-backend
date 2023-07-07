import { CreationOptional, DataTypes, ForeignKey, Model, NonAttribute, Sequelize } from 'sequelize';

import { StatusCodes } from '../../types/errors.type';
import User from './user.model';
import { BlogAttributes, BlogCreation } from '../../types/blog.type';
import { getError } from '../../utils/middleware/errorHandler';

export type BlogOrNothing = Blog | null | undefined;

class Blog extends Model<BlogAttributes, BlogCreation> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare author: string;
  declare url: string;
  declare likes: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare ownerId: ForeignKey<User['id']>;

  declare owner?: NonAttribute<User>;

  auth(user: User): NonAttribute<boolean> {
    const isAuth = this.ownerId === user.id;
    if (!isAuth) {
      throw getError({ message: 'Only the owner can update the blog!', status: StatusCodes.FORBIDDEN });
    }
    return isAuth;
  }
}

export const blogInit = (sequelize: Sequelize) => {
  Blog.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING(128), allowNull: false },
      author: { type: DataTypes.STRING(128), allowNull: false },
      url: { type: DataTypes.STRING(128), allowNull: false },
      likes: { type: DataTypes.INTEGER, allowNull: false },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: User,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'blogs',
      underscored: true,
      timestamps: true,
    }
  );

  return Blog;
};

export default Blog;
