import { Context, Migration } from '../../src/sequelize/types';

export const up: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.createTable('likes', {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    blog_id: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'blogs',
        key: 'id',
      },
    },
  });
};

export const down: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.dropTable('likes');
};
