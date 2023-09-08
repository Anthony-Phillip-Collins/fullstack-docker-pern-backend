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
import Like from './like.model';
import Reading from './reading.model';

export type UserOrNothing = User | null | undefined;

class User extends Model<UserAttributes, UserCreate> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare hashedPassword: string;
  declare admin: boolean;
  declare disabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare blogs?: NonAttribute<Blog[]>;
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

  declare readings?: NonAttribute<Reading[]>;
  declare getReadings: HasManyGetAssociationsMixin<Reading>;
  declare addReading: HasManyAddAssociationMixin<Reading, number>;
  declare addReadings: HasManyAddAssociationsMixin<Reading, number>;
  declare setReadings: HasManySetAssociationsMixin<Reading, number>;
  declare removeReading: HasManyRemoveAssociationMixin<Reading, number>;
  declare removeReadings: HasManyRemoveAssociationsMixin<Reading, number>;
  declare hasReading: HasManyHasAssociationMixin<Reading, number>;
  declare hasReadings: HasManyHasAssociationsMixin<Reading, number>;
  declare countReadings: HasManyCountAssociationsMixin;
  declare createReading: HasManyCreateAssociationMixin<Reading, 'userId'>;

  declare likings?: NonAttribute<Like[]>;
  declare getLikings: HasManyGetAssociationsMixin<Like>;
  declare addLiking: HasManyAddAssociationMixin<Like, number>;
  declare addLikings: HasManyAddAssociationsMixin<Like, number>;
  declare setLikings: HasManySetAssociationsMixin<Like, number>;
  declare removeLiking: HasManyRemoveAssociationMixin<Like, number>;
  declare removeLikings: HasManyRemoveAssociationsMixin<Like, number>;
  declare hasLiking: HasManyHasAssociationMixin<Like, number>;
  declare hasLikings: HasManyHasAssociationsMixin<Like, number>;
  declare countLikings: HasManyCountAssociationsMixin;
  declare createLiking: HasManyCreateAssociationMixin<Like, 'userId'>;

  declare static associations: {
    blogs: Association<User, Blog>;
    readings: Association<User, Blog>;
    likings: Association<User, Blog>;
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
        validate: {
          notEmpty: {
            msg: 'Name is required!',
          },

          notNull: {
            msg: 'Name is required!',
          },

          len: {
            args: [3, 128],
            msg: 'Name must be between 3 and 128 characters long!',
          },
        },
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
    },
  );
  return User;
};

export default User;
