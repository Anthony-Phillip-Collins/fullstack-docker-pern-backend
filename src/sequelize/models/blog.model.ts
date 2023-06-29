import { DataTypes, Model, Sequelize } from 'sequelize';
import { Blog, NewBlog } from '../../types/blog.type';

class BlogModel extends Model<Blog, NewBlog> {
  declare id: number;
  declare title: string;
  declare author: string;
  declare url: string;
  declare likes: number;
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
