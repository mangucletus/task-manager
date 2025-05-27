import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEAM_TABLE_NAME?: string;
      TASK_TABLE_NAME?: string;
    }
  }
}

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

interface HandlerEvent {
  arguments: { id: string };
  identity: { sub: string };
}

export const handler = async (event: HandlerEvent) => {
  const { id } = event.arguments;
  const { sub } = event.identity;

  const teamTableName = process.env.TEAM_TABLE_NAME || 'Team';
  const taskTableName = process.env.TASK_TABLE_NAME || 'Task';

  // Get task
  const taskResult = await ddb.send(new GetCommand({
    TableName: taskTableName,
    Key: { id },
  }));
  const task = taskResult.Item;

  if (!task) {
    throw new Error('Task not found');
  }

  // Get team
  const teamResult = await ddb.send(new GetCommand({
    TableName: teamTableName,
    Key: { id: task.teamId },
  }));
  const team = teamResult.Item;

  if (!team || team.adminId !== sub) {
    throw new Error('Only team admin can delete tasks');
  }

  // Delete task
  await ddb.send(new DeleteCommand({
    TableName: taskTableName,
    Key: { id },
  }));

  return task;
};
