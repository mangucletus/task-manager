export const createTeam = /* GraphQL */ `
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      adminId
    }
  }
`;

export const createTaskForTeam = /* GraphQL */ `
  mutation CreateTaskForTeam($input: CreateTaskInput!) {
    createTaskForTeam(input: $input) {
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

export const updateTaskAsAdmin = /* GraphQL */ `
  mutation UpdateTaskAsAdmin($id: ID!, $input: UpdateTaskInput!) {
    updateTaskAsAdmin(id: $id, input: $input) {
      id
      title
      description
      status
      deadline
      assignedToId
    }
  }
`;

export const updateTask = /* GraphQL */ `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      description
      status
      deadline
      assignedToId
    }
  }
`;

export const deleteTaskAsAdmin = /* GraphQL */ `
  mutation DeleteTaskAsAdmin($id: ID!) {
    deleteTaskAsAdmin(id: $id) {
      id
    }
  }
`;