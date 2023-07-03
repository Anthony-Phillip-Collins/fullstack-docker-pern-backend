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
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import Blog from './blog.model';
import { StatusCodes } from '../../types/errors.type';

class User extends Model<InferAttributes<User, { omit: 'blogs' }>, InferCreationAttributes<User, { omit: 'blogs' }>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare hashedPassword: string;

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

export type UserAttributes = Pick<User, 'id' | 'name' | 'username' | 'hashedPassword'>;
export type UserCreationAttributes = Omit<UserAttributes, 'id'>;
export type UserCreationAttributesInput = Pick<UserAttributes, 'username' | 'name'> & {
  password: string;
};
export type UserUpdateAttributes = Partial<Pick<UserCreationAttributes, 'name' | 'hashedPassword'>>;
export type UserUpdateAttributesInput = Partial<Pick<UserCreationAttributesInput, 'name' | 'password'>>;

export type UserNonSensitiveAttributes = Omit<UserAttributes, 'hashedPassword'>;

export type UserForToken = Pick<UserAttributes, 'username' | 'name'>;
export interface UserWithToken extends UserForToken {
  token: string;
}

export type UserLogin = Pick<UserCreationAttributesInput, 'username' | 'password'>;
export type UserOrNothing = UserAttributes | null | undefined;

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
      tableName: 'users',
      underscored: true,
      timestamps: false,
      sequelize,
    }
  );
  return User;
};

export default User;
