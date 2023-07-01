import { DataTypes, ForeignKey, Model, Sequelize } from 'sequelize';
import { Blog, NewBlog } from '../../types/blog.type';
import { User } from '../../types/user.type';

class BlogModel extends Model<Blog, NewBlog> {
  declare id: number;
  declare title: string;
  declare author: string;
  declare url: string;
  declare likes: number;
  declare userId: ForeignKey<User['id']>;
}

export const blogModelInit = (sequelize: Sequelize) => {
  BlogModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      url: { type: DataTypes.STRING, allowNull: false },
      likes: { type: DataTypes.INTEGER, allowNull: false },
      userId: {
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
      underscored: true,
      timestamps: false,
      modelName: 'blog',
    }
  );

  return BlogModel;
};

export default BlogModel;
