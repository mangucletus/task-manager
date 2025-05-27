import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';
import { listTasks } from '../graphql/queries';
import { createTaskForTeam, updateTaskAsAdmin, deleteTaskAsAdmin } from '../graphql/mutations';

const TeamDetails = ({ user }) => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchTeamAndTasks = async () => {
      try {
        // Fetch team details (assuming a getTeam query exists)
        const teamResult = await API.graphql({
          query: /* GraphQL */ `
            query GetTeam($id: ID!) {
              getTeam(id: $id) {
                id
                name
                adminId
              }
            }
          `,
          variables: { id: teamId },
        });
        const teamData = teamResult.data.getTeam;
        setTeam(teamData);
        setIsAdmin(teamData.adminId === user.attributes.sub);

        // Fetch tasks
        const taskResult = await API.graphql({
          query: listTasks,
          variables: { filter: { teamId: { eq: teamId } } },
        });
        setTasks(taskResult.data.listTasks.items);
      } catch (error) {
        console.error('Error fetching team or tasks:', error);
      }
    };
    fetchTeamAndTasks();
  }, [teamId, user.attributes.sub]);

  const handleCreateTask = async (taskData) => {
    try {
      const result = await API.graphql({
        query: createTaskForTeam,
        variables: { input: { ...taskData, teamId, assignedToId: user.attributes.sub } },
      });
      setTasks([...tasks, result.data.createTaskForTeam]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const result = await API.graphql({
        query: updateTaskAsAdmin,
        variables: { id: taskId, input: taskData },
      });
      setTasks(tasks.map(task => task.id === taskId ? result.data.updateTaskAsAdmin : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.graphql({
        query: deleteTaskAsAdmin,
        variables: { id: taskId },
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{team?.name}</h2>
      {isAdmin && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Create Task</h3>
          {/* Add form for creating tasks */}
          <button onClick={() => handleCreateTask({ title: 'New Task', status: 'pending' })}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold">Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="mb-2">
            <span>{task.title} - {task.status} - {new Date(task.deadline).toLocaleString()}</span>
            {isAdmin && (
              <>
                <button
                  onClick={() => handleUpdateTask(task.id, { status: 'in-progress' })}
                  className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Update Status
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;