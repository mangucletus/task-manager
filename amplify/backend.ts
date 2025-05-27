import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createTaskForTeam } from './functions/createTaskForTeam/resource';
import { deleteTaskAsAdmin } from './functions/deleteTaskAsAdmin/resource';
import { updateTaskAsAdmin } from './functions/updateTaskAsAdmin/resource';

export const backend = defineBackend({
  auth,
  data,
  createTaskForTeam,
  deleteTaskAsAdmin,
  updateTaskAsAdmin,
});