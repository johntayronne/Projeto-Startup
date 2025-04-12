import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/startups')}
          >
            <h2 className="text-xl font-semibold mb-2">My Startups</h2>
            <p className="text-gray-600">Manage your startup projects</p>
          </div>
          <div 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/startup/new')}
          >
            <h2 className="text-xl font-semibold mb-2">Create New Startup</h2>
            <p className="text-gray-600">Start a new venture</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;