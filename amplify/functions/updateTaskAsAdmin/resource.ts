import { defineFunction } from '@aws-amplify/backend';

export const updateTaskAsAdmin = defineFunction({
  name: 'updateTaskAsAdmin',
  entry: './handler.ts',
});