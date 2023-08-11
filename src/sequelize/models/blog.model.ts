import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
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

import { BlogAttributes, BlogCreation } from '../../types/blog.type';
import { UserAttributes } from '../../types/user.type';
import User from './user.model';
import Reading from './reading.model';

export type BlogOrNothing = Blog | null | undefined;

class Blog extends Model<BlogAttributes, BlogCreation> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare author: string;
  declare url: string;
  declare likes: number;
  declare year: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare ownerId: ForeignKey<UserAttributes['id']>;
  declare readerCount?: NonAttribute<number>;

  declare owner?: NonAttribute<User>;

  declare readers?: NonAttribute<Reading[]>;
  declare getReaders: HasManyGetAssociationsMixin<Reading>;
  declare addReader: HasManyAddAssociationMixin<Reading, number>;
  declare addReaders: HasManyAddAssociationsMixin<Reading, number>;
  declare setReaders: HasManySetAssociationsMixin<Reading, number>;
  declare removeReader: HasManyRemoveAssociationMixin<Reading, number>;
  declare removeReaders: HasManyRemoveAssociationsMixin<Reading, number>;
  declare hasReader: HasManyHasAssociationMixin<Reading, number>;
  declare hasReaders: HasManyHasAssociationsMixin<Reading, number>;
  declare countReaders: HasManyCountAssociationsMixin;
  declare createReader: HasManyCreateAssociationMixin<Reading, 'blogId'>;

  declare static associations: {
    readers: Association<Blog, Reading>;
  };
}

export const blogInit = (sequelize: Sequelize) => {
  Blog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(128),
        validate: {
          notEmpty: {
            msg: 'Title cannot be empty',
          },

          len: {
            args: [3, 128],
            msg: 'Title must be between 3 and 128 characters long',
          },
        },
      },
      author: {
        type: DataTypes.STRING(128),
        validate: {
          notEmpty: {
            msg: 'Author cannot be empty',
          },

          len: {
            args: [3, 128],
            msg: 'Author must be between 3 and 128 characters long',
          },
        },
      },
      url: {
        type: DataTypes.STRING(128),
        validate: {
          notEmpty: {
            msg: 'Url cannot be empty',
          },
          isUrl: {
            msg: 'Url must be a valid url',
          },
        },
      },
      likes: {
        type: DataTypes.INTEGER,
        validate: {
          min: {
            args: [0],
            msg: 'Likes must be greater than 0',
          },

          isInt: {
            msg: 'Likes must be an integer',
          },

          notEmpty: {
            msg: 'Likes cannot be empty',
          },

          notNull: false,
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1992,
        validate: {
          min: {
            args: [1991],
            msg: 'Year must be greater than 1990',
          },
          max: {
            args: [new Date().getFullYear()],
            msg: 'Year must be less or equal than current year',
          },
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
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
