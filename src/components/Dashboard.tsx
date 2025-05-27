import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ teams, onCreateTeam }) => {
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTeam(teamName);
    setTeamName('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Teams</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Team
        </button>
      </form>
      <ul>
        {teams.map(team => (
          <li key={team.id} className="mb-2">
            <button
              onClick={() => navigate(`/team/${team.id}`)}
              className="text-blue-600 hover:underline"
            >
              {team.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;