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
import BlogModel from './blog.model';

// 'blogs' is excluded as it's not an attribute, it's an association.
class User extends Model<InferAttributes<User, { omit: 'blogs' }>, InferCreationAttributes<User, { omit: 'blogs' }>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare hashedPassword: string;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getBlogs: HasManyGetAssociationsMixin<BlogModel>; // Note the null assertions!
  declare addBlog: HasManyAddAssociationMixin<BlogModel, number>;
  declare addBlogs: HasManyAddAssociationsMixin<BlogModel, number>;
  declare setBlogs: HasManySetAssociationsMixin<BlogModel, number>;
  declare removeBlog: HasManyRemoveAssociationMixin<BlogModel, number>;
  declare removeBlogs: HasManyRemoveAssociationsMixin<BlogModel, number>;
  declare hasBlog: HasManyHasAssociationMixin<BlogModel, number>;
  declare hasBlogs: HasManyHasAssociationsMixin<BlogModel, number>;
  declare countBlogs: HasManyCountAssociationsMixin;
  declare createBlog: HasManyCreateAssociationMixin<BlogModel, 'ownerId'>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare blogs?: NonAttribute<BlogModel[]>; // Note this is optional since it's only populated when explicitly requested in code

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get fullName(): NonAttribute<string> {
    return this.name;
  }

  declare static associations: {
    blogs: Association<User, BlogModel>;
  };
}

export type UserAttributes = Pick<User, 'id' | 'name' | 'username' | 'hashedPassword'>;
export type UserCreationAttributes = Omit<UserAttributes, 'id'>;
export type UserMaybe = User | null | undefined;

export const userModelInit = (sequelize: Sequelize) => {
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
