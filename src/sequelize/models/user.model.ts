import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import { StatusCodes } from '../../types/errors.type';
import Blog from './blog.model';
import { UserAttributes, UserCreate } from '../../types/user.type';

export type UserOrNothing = UserAttributes | null | undefined;

class User extends Model<UserAttributes, UserCreate> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare hashedPassword: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare getBlogs: HasManyGetAssociationsMixin<Blog>;
  declare addBlog: HasManyAddAssociationMixin<Blog, number>;
  declare addBlogs: HasManyAddAssociationsMixin<Blog, number>;
  declare setBlogs: HasManySetAssociationsMixin<Blog, number>;
  declare removeBlog: HasManyRemoveAssociationMixin<Blog, number>;
  declare removeBlogs: HasManyRemoveAssociationsMixin<Blog, number>;
  declare hasBlog: HasManyHasAssociationMixin<Blog, number>;
  declare hasBlogs: HasManyHasAssociationsMixin<Blog, number>;
  declare countBlogs: HasManyCountAssociationsMixin;
  declare createBlog: HasManyCreateAssociationMixin<Blog, 'ownerId'>;

  declare blogs?: NonAttribute<Blog[]>;

  declare static associations: {
    blogs: Association<User, Blog>;
  };

  auth(id: string | number): NonAttribute<boolean> {
    const isAuth = this.id === Number(id);
    if (!isAuth) {
      const error = new Error('Not authorized!');
      error.status = StatusCodes.UNAUTHORIZED;
      throw error;
    }
    return isAuth;
  }
}

export const userInit = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
      timestamps: true,
    }
  );
  return User;
};

export default User;
