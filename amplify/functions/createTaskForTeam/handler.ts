import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

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
  arguments: {
    input: {
      teamId: string;
      title: string;
      description?: string;
      status?: string;
      deadline?: string;
      assignedToId: string;
    };
  };
  identity: {
    sub: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const handler = async (event: HandlerEvent) => {
  const { input } = event.arguments;
  const { sub } = event.identity;

  const teamTableName = process.env.TEAM_TABLE_NAME || 'Team';
  const taskTableName = process.env.TASK_TABLE_NAME || 'Task';

  const teamResult = await ddb.send(
    new GetCommand({
      TableName: teamTableName,
      Key: { id: input.teamId },
    })
  );

  const team = teamResult.Item;
  if (!team || team.adminId !== sub) {
    throw new Error('Only team admin can create tasks');
  }

  const task = {
    id: uuidv4(),
    title: input.title,
    description: input.description || null,
    status: input.status || 'PENDING',
    deadline: input.deadline || null,
    teamId: input.teamId,
    assignedToId: input.assignedToId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await ddb.send(
    new PutCommand({
      TableName: taskTableName,
      Item: task,
    })
  );

  return task;
};
