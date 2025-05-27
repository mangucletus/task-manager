import { defineFunction } from '@aws-amplify/backend';

export const createTaskForTeam = defineFunction({
  name: 'createTaskForTeam',
  entry: './handler.ts',
});