import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GenerateMVP: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Generate MVP</h1>
        {/* MVP generation form */}
      </div>
    </div>
  );
};

export default GenerateMVP;