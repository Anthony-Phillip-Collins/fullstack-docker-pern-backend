import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import User from './user.model';
import { StatusCodes } from '../../types/errors.type';

class Blog extends Model<InferAttributes<Blog>, InferCreationAttributes<Blog>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;

  // foreign keys are automatically added by associations methods (like Blog.belongsTo)
  // by branding them using the `ForeignKey` type, `Blog.init` will know it does not need to
  // display an error if ownerId is missing.
  declare ownerId: ForeignKey<User['id']>;
  declare title: string;
  declare author: string;
  declare url: string;
  declare likes: number;
  // `owner` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare owner?: NonAttribute<User>;

  checkAuth(user: User): NonAttribute<boolean> {
    const isAuth = this.ownerId === user.id;
    if (!isAuth) {
      const error = new Error('Only the owner can update the blog!');
      error.status = StatusCodes.FORBIDDEN;
      throw error;
    }
    return isAuth;
  }
}

export type BlogAttributes = Pick<Blog, 'id' | 'title' | 'author' | 'url' | 'likes'>;
export type BlogCreationAttributes = Omit<BlogAttributes, 'id'>;
export type BlogUpdateAttributes = Pick<BlogAttributes, 'likes'>;

export const blogModelInit = (sequelize: Sequelize) => {
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'blogs',
      underscored: true,
      timestamps: false,
    }
  );

  return Blog;
};

export default Blog;

// class BlogModel extends Model<Blog, NewBlog> {
//   declare id: number;
//   declare title: string;
//   declare author: string;
//   declare url: string;
//   declare likes: number;
//   declare userId: ForeignKey<UserType['id']>;
// }

// export const blogModelInit = (sequelize: Sequelize) => {
//   BlogModel.init(
//     {
//       id: {
//         type: DataTypes.INTEGER.UNSIGNED,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       title: { type: DataTypes.STRING, allowNull: false },
//       author: { type: DataTypes.STRING, allowNull: false },
//       url: { type: DataTypes.STRING, allowNull: false },
//       likes: { type: DataTypes.INTEGER, allowNull: false },
//       userId: {
//         type: DataTypes.INTEGER.UNSIGNED,
//         allowNull: false,
//         references: {
//           model: 'users',
//           key: 'id',
//         },
//       },
//     },
//     {
//       sequelize,
//       underscored: true,
//       timestamps: false,
//       modelName: 'blog',
//     }
//   );

//   return BlogModel;
// };

// export default BlogModel;
