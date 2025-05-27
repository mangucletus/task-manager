export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($assignedToId: ID!) {
    onCreateTask(assignedToId: $assignedToId) {
      id
      title
      description
      status
      deadline
      teamId
      assignedToId
    }
  }
`;

export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($assignedToId: ID!) {
    onUpdateTask(assignedToId: $assignedToId) {
      id
      title
      description
      status
      deadline
      assignedToId
    }
  }
`;