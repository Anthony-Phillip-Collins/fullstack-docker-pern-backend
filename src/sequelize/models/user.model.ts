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
import { UserAttributes, UserCreate } from '../../types/user.type';
import Blog from './blog.model';

export type UserOrNothing = UserAttributes | null | undefined;

class User extends Model<UserAttributes, UserCreate> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare hashedPassword: string;
  declare admin: boolean;
  declare disabled: boolean;
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
}

export const userInit = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
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
        validate: {
          isEmail: {
            msg: 'Invalid email on username!',
          },
        },
      },
      hashedPassword: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
