import { useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTask, onUpdateTask } from '../graphql/subscriptions';

const TaskNotifications = ({ userId }) => {
  useEffect(() => {
    const createSub = API.graphql(
      graphqlOperation(onCreateTask, { assignedToId: userId })
    ).subscribe({
      next: ({ provider, value }) => {
        alert(`New task assigned: ${value.data.onCreateTask.title}`);
      },
    });

    const updateSub = API.graphql(
      graphqlOperation(onUpdateTask, { assignedToId: userId })
    ).subscribe({
      next: ({ provider, value }) => {
        alert(`Task updated: ${value.data.onUpdateTask.title}`);
      },
    });

    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
    };
  }, [userId]);

  return null;
};

export default TaskNotifications;