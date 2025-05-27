import { Routes, Route, useNavigate } from 'react-router-dom';
import { API } from 'aws-amplify';
import { getUser } from './graphql/queries';
import { createTeam } from './graphql/mutations';
import { useEffect, useState } from 'react';
import TeamDetails from './components/TeamDetails';
import Dashboard from './components/Dashboard';

const App = ({ user, signOut }) => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const result = await API.graphql({
          query: getUser,
          variables: { id: user.attributes.sub },
        });
        const userData = result.data.getUser;
        const teams = userData.teams.items.map(membership => membership.team);
        setTeams(teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchUserTeams();
  }, [user.attributes.sub]);

  const handleCreateTeam = async (name) => {
    try {
      const team = await API.graphql({
        query: createTeam,
        variables: { input: { name, adminId: user.attributes.sub } },
      });
      setTeams([...teams, team.data.createTeam]);
      navigate(`/team/${team.data.createTeam.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management System</h1>
        <button onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded">
          Sign Out
        </button>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard teams={teams} onCreateTeam={handleCreateTeam} />} />
        <Route path="/team/:teamId" element={<TeamDetails user={user} />} />
      </Routes>
    </div>
  );
};

export default App;