import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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

interface UpdateTaskAsAdminEvent {
  arguments: {
    id: string;
    input: Record<string, any>;
  };
  identity: {
    sub: string;
  };
}

export const handler = async (event: UpdateTaskAsAdminEvent) => {
  const { id, input } = event.arguments;
  const { sub } = event.identity;

  const teamTableName = process.env.TEAM_TABLE_NAME || 'Team';
  const taskTableName = process.env.TASK_TABLE_NAME || 'Task';

  // Fetch the task
  const taskResult = await ddb.send(new GetCommand({
    TableName: taskTableName,
    Key: { id },
  }));
  const task = taskResult.Item;
  if (!task) {
    throw new Error('Task not found');
  }

  // Fetch the team
  const teamResult = await ddb.send(new GetCommand({
    TableName: teamTableName,
    Key: { id: task.teamId },
  }));
  const team = teamResult.Item;
  if (!team || team.adminId !== sub) {
    throw new Error('Only team admin can update tasks');
  }

  // Build update expression
  const updateExpression = [];
  const expressionAttributeValues: Record<string, any> = {};
  const updatedAt = new Date().toISOString();

  updateExpression.push('updatedAt = :updatedAt');
  expressionAttributeValues[':updatedAt'] = updatedAt;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      updateExpression.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }
  }

  await ddb.send(new UpdateCommand({
    TableName: taskTableName,
    Key: { id },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
  }));

  return { id, ...task, ...input, updatedAt };
};
