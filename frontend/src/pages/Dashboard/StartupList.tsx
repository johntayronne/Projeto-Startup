import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Startup {
  id: string;
  name: string;
  description: string;
  status: string;
  validationScore: number;
}

const StartupList: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch startups
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Startups</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map(startup => (
            <div
              key={startup.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg"
              onClick={() => router.push(`/dashboard/startups/${startup.id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{startup.name}</h2>
              <p className="text-gray-600">{startup.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupList;