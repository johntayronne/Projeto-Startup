import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StartupDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Startup Details</h1>
      {/* Startup details content */}
    </div>
  );
};

export default StartupDetails;