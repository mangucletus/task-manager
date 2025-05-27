import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const TaskStatus = a.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

const schema = a.schema({
  User: a.model({
    email: a.string().required(),
    name: a.string(),
    teams: a.hasMany('TeamMembership', 'userId'),
    adminOfTeams: a.hasMany('Team', 'adminId'),
    assignedTasks: a.hasMany('Task', 'assignedToId'),
  }).authorization(allow => [allow.owner()]),

  Team: a.model({
    name: a.string().required(),
    adminId: a.id().required(),
    admin: a.belongsTo('User', 'adminId'),
    memberships: a.hasMany('TeamMembership', 'teamId'),
    tasks: a.hasMany('Task', 'teamId'),
  }).authorization(allow => [
    allow.authenticated().to(['read', 'create', 'update', 'delete']),
  ]),

  TeamMembership: a.model({
    teamId: a.id().required(),
    userId: a.id().required(),
    team: a.belongsTo('Team', 'teamId'),
    user: a.belongsTo('User', 'userId'),
  }).authorization(allow => [allow.authenticated()]),

  Task: a.model({
    title: a.string().required(),
    description: a.string(),
    status: TaskStatus,
    deadline: a.datetime(),
    teamId: a.id().required(),
    assignedToId: a.id().required(),
    team: a.belongsTo('Team', 'teamId'),
    assignedTo: a.belongsTo('User', 'assignedToId'),
  }).authorization(allow => [
    allow.authenticated().to(['read', 'create', 'update', 'delete']),
  ]),

  createTaskForTeam: a.mutation()
    .arguments({
      input: a.customType({
        title: a.string().required(),
        description: a.string(),
        status: TaskStatus,
        deadline: a.datetime(),
        teamId: a.id().required(),
        assignedToId: a.id().required(),
      }),
    })
    .returns(a.ref('Task'))
    .handler(a.handler.function('createTaskForTeam')) // <-- ensure this is present
    .authorization(allow => [allow.authenticated()]), // <-- ensure this is present

  updateTaskAsAdmin: a.mutation()
    .arguments({
      id: a.id().required(),
      input: a.customType({
        title: a.string(),
        description: a.string(),
        status: TaskStatus,
        deadline: a.datetime(),
        assignedToId: a.id(),
      }),
    })
    .returns(a.ref('Task'))
    .handler(a.handler.function('updateTaskAsAdmin'))
    .authorization(allow => [allow.authenticated()]),

  deleteTaskAsAdmin: a.mutation()
    .arguments({ id: a.id().required() })
    .returns(a.ref('Task'))
    .handler(a.handler.function('deleteTaskAsAdmin'))
    .authorization(allow => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
