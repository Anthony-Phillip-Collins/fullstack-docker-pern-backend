import { DataTypes } from 'sequelize';
import { Context, Migration } from '../../src/sequelize/types';

export const up: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.createTable('users', {
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
    },
    hashed_password: {
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });

  await queryInterface.createTable('blogs', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(128), allowNull: false },
    author: { type: DataTypes.STRING(128), allowNull: false },
    url: { type: DataTypes.STRING(128), allowNull: false },
    likes: { type: DataTypes.INTEGER, allowNull: false },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.dropTable('blogs');
  await queryInterface.dropTable('users');
};
