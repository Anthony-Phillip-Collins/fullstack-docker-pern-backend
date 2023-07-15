import { Context, Migration } from '../../src/sequelize/types';

export const up: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.createTable('readings', {
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
    read: {
      type: 'BOOLEAN',
      allowNull: false,
      defaultValue: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.dropTable('readings');
};
