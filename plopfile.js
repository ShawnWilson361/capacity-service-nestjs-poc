/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-call */
module.exports = (plop) => {
  // repository generator
  plop.setGenerator('entity', {
    description: 'typeorm entity',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'enter the entity name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}.entity.ts',
        templateFile: 'plop-templates/entity.ts.hbs',
      },
    ],
  }),
    // repository generator
    plop.setGenerator('repository', {
      description: 'custom entity repository',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'enter the entity name',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/repositories/{{camelCase name}}.repository.ts',
          templateFile: 'plop-templates/repository.ts.hbs',
        },
      ],
    }),
    // service generator
    plop.setGenerator('service', {
      description: 'custom entity repository',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'enter the entity name',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/services/{{camelCase name}}.service.ts',
          templateFile: 'plop-templates/service.ts.hbs',
        },
      ],
    }),
    // resolver generator
    plop.setGenerator('resolver', {
      description: 'custom entity repository',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'enter the entity name',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/resolvers/{{camelCase name}}.resolver.ts',
          templateFile: 'plop-templates/resolver.ts.hbs',
        },
      ],
    }),
    // resolver generator
    plop.setGenerator('module', {
      description: 'custom entity repository',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'enter the entity name',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/modules/{{camelCase name}}.module.ts',
          templateFile: 'plop-templates/module.ts.hbs',
        },
      ],
    });
};
