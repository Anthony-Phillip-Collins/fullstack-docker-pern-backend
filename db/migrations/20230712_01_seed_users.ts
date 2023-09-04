import { Op } from 'sequelize';
import { Context, Migration } from '../../src/sequelize/types';

export const up: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  const timestamp = {
    created_at: new Date(),
    updated_at: new Date(),
  };

  await queryInterface.bulkInsert('users', [
    {
      name: 'Admin',
      username: 'admin@foobar.com',
      hashed_password: '$2b$10$5EguhOmNO6hE4m11nenxkOncukTWmf/aEFcFm9pvENUZhberk1ZLe',
      admin: true,
      disabled: false,
      ...timestamp,
    },
    {
      name: 'User',
      username: 'user@foobar.com',
      hashed_password: '$2b$10$5EguhOmNO6hE4m11nenxkOncukTWmf/aEFcFm9pvENUZhberk1ZLe',
      admin: false,
      disabled: false,
      ...timestamp,
    },
  ]);
};

export const down: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.bulkDelete(
    'users',
    {
      admin: {
        [Op.in]: [true, false],
      },
    },
    {},
  );
};
