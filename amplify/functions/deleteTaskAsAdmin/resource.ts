import { defineFunction } from '@aws-amplify/backend';

export const deleteTaskAsAdmin = defineFunction({
  name: 'deleteTaskAsAdmin',
  entry: './handler.ts',
});