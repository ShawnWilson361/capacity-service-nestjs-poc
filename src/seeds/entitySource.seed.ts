import { v4 as uuid } from 'uuid';

import { EntitySource } from '../entities';

const seedData = (): EntitySource[] => {
  return [
    {
      id: '537573c0-6755-460a-b55d-26c6a8412d65',
      name: 'activities',
      description: 'Haven Experience Activity',
      keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
      isLive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

export default seedData;
