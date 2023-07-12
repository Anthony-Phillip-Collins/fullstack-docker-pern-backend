import { Context, Migration } from '../../src/sequelize/types';

export const up: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.addColumn('blogs', 'year', {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 2021,
  });
};

export const down: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.removeColumn('blogs', 'year');
};
