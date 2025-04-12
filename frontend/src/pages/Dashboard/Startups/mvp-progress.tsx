import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../components/layouts/DashboardLayout';

type Status = 'IDEA' | 'VALIDATION' | 'MVP' | 'LAUNCHED';

interface Startup {
  id: string;
  name: string;
  description: string;
  status: Status;
}

const MVPProgress: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchStartupDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/startups/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch startup details');
        }

        const data = await response.json();
        setStartup(data);
      } catch (err) {
        console.error('Error fetching startup details:', err);
        setError('Failed to load startup details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupDetails();
  }, [id]);

  const getProgressPercentage = (status: Status) => {
    switch (status) {
      case 'IDEA':
        return '25%';
      case 'VALIDATION':
        return '50%';
      case 'MVP':
        return '75%';
      case 'LAUNCHED':
        return '100%';
      default:
        return '0%';
    }
  };

  // Definição do objeto stageLabels com tipos corretos
  const stageLabels: Record<Status, { title: string; description: string }> = {
    IDEA: { title: 'Idea', description: 'Initial concept' },
    VALIDATION: { title: 'Validation', description: 'Market research' },
    MVP: { title: 'MVP', description: 'Minimum viable product' },
    LAUNCHED: { title: 'Launched', description: 'Product in market' },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Loading startup details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !startup) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500">{error || 'Startup not found'}</p>
            <Link href="/dashboard/startups" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              Back to Startups
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MVP Progress</h1>
            <p className="mt-1 text-sm text-gray-500">
              {startup.name}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/startups/${startup.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Startup
            </Link>
            <Link
              href={`/dashboard/startups/${startup.id}/mvp`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {startup.status === 'MVP' || startup.status === 'LAUNCHED' ? 'View MVP' : 'Generate MVP'}
            </Link>
          </div>
        </div>

        <div className="py-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Development Stages</h4>
              
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: getProgressPercentage(startup.status) }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {(['IDEA', 'VALIDATION', 'MVP', 'LAUNCHED'] as Status[]).map((stage, index) => {
                  const isActive = startup.status === stage || 
                    (index < ['IDEA', 'VALIDATION', 'MVP', 'LAUNCHED'].indexOf(startup.status));
                  const borderColor = isActive ? 'border-green-500' : 'border-gray-300';
                  const bgColor = isActive ? 'bg-green-100' : 'bg-gray-100';
                  const iconColor = isActive ? 'text-green-500' : 'text-gray-400';

                  return (
                    <div
                      key={stage}
                      className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${borderColor}`}
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 rounded-md p-1 ${bgColor}`}>
                            <svg
                              className={`h-5 w-5 ${iconColor}`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                  stage === 'IDEA'
                                    ? 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                    : stage === 'VALIDATION'
                                    ? 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                                    : stage === 'MVP'
                                    ? 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                                    : 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                                }
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h5 className="text-lg font-medium">{stageLabels[stage].title}</h5>
                            <p className="text-sm text-gray-500">{stageLabels[stage].description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MVPProgress;