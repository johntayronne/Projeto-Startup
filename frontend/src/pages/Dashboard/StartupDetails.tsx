import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StartupDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Startup Details</h1>
        {/* Details content */}
      </div>
    </div>
  );
};

export default StartupDetails;