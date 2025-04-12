import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Link from 'next/link';



interface Startup {
  id: string;
  name: string;
  description: string;
}

interface MVPData {
  features: string[];
  userFlows: string[];
  technologies: string[];
  designNotes: string;
  mockupUrl?: string;
}

export default function GenerateMVP() {
  const router = useRouter();
  const { id } = router.query;
  
  const [startup, setStartup] = useState<Startup | null>(null);
  const [mvpData, setMvpData] = useState<MVPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

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

        // Check if MVP data already exists
        try {
          const mvpResponse = await fetch(`http://localhost:3001/api/startups/${id}/mvp`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (mvpResponse.ok) {
            const mvpData = await mvpResponse.json();
            setMvpData(mvpData);
          }
        } catch (mvpError) {
          console.error('Error fetching MVP data:', mvpError);
        }

      } catch (err) {
        console.error('Error fetching startup details:', err);
        setError('Failed to load startup details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupDetails();
  }, [id]);

  const handleGenerateMVP = async () => {
    if (!startup || !id || typeof id !== 'string') return;
    
    try {
      setGenerating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/ai/mvp/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate MVP');
      }

      const generatedData = await response.json();
      setMvpData(generatedData);
    } catch (err) {
      console.error('Error generating MVP:', err);
      setError('Failed to generate MVP. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate MVP for {startup?.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a minimum viable product specification for your startup
            </p>
          </div>
          <div>
            {startup && (
              <Link
                href={`/dashboard/startups/${startup.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Startup
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="mt-6">
            {mvpData ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    MVP Specifications
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    AI-generated minimum viable product details for {startup?.name}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Core Features</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {mvpData.features.map((feature, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">{feature}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">User Flows</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {mvpData.userFlows.map((flow, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">{flow}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Technologies</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {mvpData.technologies.map((tech, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">{tech}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Design Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <p className="whitespace-pre-line">{mvpData.designNotes}</p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white shadow-sm rounded-lg">
                <p className="text-gray-500 mb-4">No MVP data available yet. Generate an MVP to get started.</p>
                <button
                  onClick={handleGenerateMVP}
                  disabled={generating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate MVP'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
