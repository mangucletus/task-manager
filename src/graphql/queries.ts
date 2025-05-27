export const listTeams = /* GraphQL */ `
  query ListTeams {
    listTeams {
      items {
        id
        name
        adminId
        tasks {
          items {
            id
            title
            status
            deadline
            assignedToId
          }
        }
      }
    }
  }
`;

export const listTasks = /* GraphQL */ `
  query ListTasks($filter: TableTaskFilterInput) {
    listTasks(filter: $filter) {
      items {
        id
        title
        description
        status
        deadline
        assignedToId
      }
    }
  }
`;

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      name
      teams {
        items {
          team {
            id
            name
          }
        }
      }
    }
  }
`;