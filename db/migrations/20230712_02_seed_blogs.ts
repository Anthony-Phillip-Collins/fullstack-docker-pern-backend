import { Op } from 'sequelize';
import { Context, Migration } from '../../src/sequelize/types';

export const up: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  const timestamp = {
    created_at: new Date(),
    updated_at: new Date(),
  };

  await queryInterface.bulkInsert('blogs', [
    {
      title: 'Robin Wieruch’s Blog',
      author: 'Robin Wieruch',
      url: 'https://www.robinwieruch.de/blog/',
      likes: 7,
      owner_id: 2,
      ...timestamp,
    },
    {
      title: 'Read more about React',
      author: 'Robin Wieruch',
      url: 'https://www.robinwieruch.de/categories/react/',
      likes: 4,
      owner_id: 2,
      ...timestamp,
    },
    {
      title: 'Swizec Teller’s Blog',
      author: 'Swizec Teller',
      url: 'https://swizec.com/blog/',
      likes: 9,
      owner_id: 2,
      ...timestamp,
    },
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 6,
      owner_id: 1,
      ...timestamp,
    },
    {
      title: 'Learn React',
      author: 'Michael Chan',
      url: 'https://learnreact.com/',
      likes: 3,
      owner_id: 1,
      ...timestamp,
    },
    {
      title: 'Josh Comeau’s Blog',
      author: 'Josh Comeau',
      url: 'https://www.joshwcomeau.com/',
      likes: 12,
      owner_id: 1,
      ...timestamp,
    },
    {
      title: 'Overreacted',
      author: 'Dan Abramov',
      url: 'https://overreacted.io/',
      likes: 10,
      owner_id: 1,
      ...timestamp,
    },
    {
      title: 'Just JavaScript',
      author: 'Dan Abramov',
      url: 'https://justjavascript.com/',
      likes: 2,
      owner_id: 1,
      ...timestamp,
    },
    {
      title: 'useHooks',
      author: 'ui.dev Team',
      url: 'https://usehooks.com/',
      likes: 8,
      owner_id: 1,
      ...timestamp,
    },
    {
      title: 'Kent C. Dodds’s Blog',
      author: 'Kent C. Dodds',
      url: 'https://kentcdodds.com/blog',
      likes: 11,
      owner_id: 2,
      ...timestamp,
    },
  ]);
};

export const down: Migration = async ({ context: queryInterface }: Context): Promise<void> => {
  await queryInterface.bulkDelete(
    'blogs',
    {
      owner_id: {
        [Op.in]: [1, 2],
      },
    },
    {}
  );
};
