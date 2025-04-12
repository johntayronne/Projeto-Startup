import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Link from 'next/link';

interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  problem: string;
  solution: string;
  targetMarket: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MarketAnalysis {
  marketSize: string;
  growthRate: string;
  competitors: string[];
  trends: string[];
  opportunities: string[];
  threats: string[];
}

export default function StartupDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [startup, setStartup] = useState<Startup | null>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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

        // Fetch market analysis if available
        try {
          const analysisResponse = await fetch(`http://localhost:3001/api/startups/${id}/market-analysis`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            setMarketAnalysis(analysisData);
          }
        } catch (analysisError) {
          console.error('Error fetching market analysis:', analysisError);
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

  const handleGenerateAnalysis = async () => {
    if (!startup) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/ai/market-analysis/${startup.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate market analysis');
      }

      const data = await response.json();
      setMarketAnalysis(data);
      alert('Market analysis generated successfully!');
    } catch (err) {
      console.error('Error generating market analysis:', err);
      alert('Failed to generate market analysis. Please try again.');
    }
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
        {/* Header */}
        <div className="flex justify-between items-center py-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(startup.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/startups/${startup.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              onClick={handleGenerateAnalysis}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Generate Analysis
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`${
                activeTab === 'market'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Market Analysis
            </button>
            <button
              onClick={() => setActiveTab('development')}
              className={`${
                activeTab === 'development'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Development
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Startup Information
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {startup.name}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Industry</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {startup.industry}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {startup.status}
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {startup.description}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Problem & Solution
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Problem</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {startup.problem}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Solution</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {startup.solution}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Target Market</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {startup.targetMarket}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div>
              {marketAnalysis ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Market Analysis
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Market Size</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {marketAnalysis.marketSize}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Growth Rate</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {marketAnalysis.growthRate}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Competitors</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {marketAnalysis.competitors.map((competitor, index) => (
                              <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                {competitor}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Trends</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {marketAnalysis.trends.map((trend, index) => (
                              <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                {trend}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Opportunities</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {marketAnalysis.opportunities.map((opportunity, index) => (
                                                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                            {opportunity}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </dd>
                                                  </div>
                                                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Threats</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                        {marketAnalysis.threats.map((threat, index) => (
                                                          <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                            {threat}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </dd>
                                                  </div>
                                                </dl>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-center py-12">
                                              <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                              </svg>
                                              <h3 className="mt-2 text-sm font-medium text-gray-900">No market analysis</h3>
                                              <p className="mt-1 text-sm text-gray-500">
                                                Get insights about your market, competitors, and opportunities.
                                              </p>
                                              <div className="mt-6">
                                                <button
                                                  type="button"
                                                  onClick={handleGenerateAnalysis}
                                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                  Generate Market Analysis
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                            
                                      {activeTab === 'development' && (
                                        <div>
                                          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                            <div className="px-4 py-5 sm:px-6 flex justify-between">
                                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Development Progress
                                              </h3>
                                              <Link
                                                href={`/dashboard/startups/${startup.id}/mvp`}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                              >
                                                Generate MVP
                                              </Link>
                                            </div>
                                            <div className="border-t border-gray-200">
                                              <div className="px-4 py-5 sm:p-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-4">Development Stages</h4>
                                                
                                                <div className="relative">
                                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                                    <div
                                                      style={{ width: getProgressPercentage() }}
                                                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                                    ></div>
                                                  </div>
                                                </div>
                                                
                                                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                                  <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                                                    startup.status === 'IDEA' || startup.status === 'VALIDATION' || startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                      ? 'border-green-500'
                                                      : 'border-gray-300'
                                                  }`}>
                                                    <div className="px-4 py-5 sm:p-6">
                                                      <div className="flex items-center">
                                                        <div className={`flex-shrink-0 rounded-md p-1 ${
                                                          startup.status === 'IDEA' || startup.status === 'VALIDATION' || startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                            ? 'bg-green-100'
                                                            : 'bg-gray-100'
                                                        }`}>
                                                          <svg className={`h-5 w-5 ${
                                                            startup.status === 'IDEA' || startup.status === 'VALIDATION' || startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                              ? 'text-green-500'
                                                              : 'text-gray-400'
                                                          }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                          </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                          <h5 className="text-lg font-medium">Idea</h5>
                                                          <p className="text-sm text-gray-500">Initial concept</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  
                                                  <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                                                    startup.status === 'VALIDATION' || startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                      ? 'border-green-500'
                                                      : 'border-gray-300'
                                                  }`}>
                                                    <div className="px-4 py-5 sm:p-6">
                                                      <div className="flex items-center">
                                                        <div className={`flex-shrink-0 rounded-md p-1 ${
                                                          startup.status === 'VALIDATION' || startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                            ? 'bg-green-100'
                                                            : 'bg-gray-100'
                                                        }`}>
                                                          <svg className={`h-5 w-5 ${
                                                            startup.status === 'VALIDATION' || startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                              ? 'text-green-500'
                                                              : 'text-gray-400'
                                                          }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                          </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                          <h5 className="text-lg font-medium">Validation</h5>
                                                          <p className="text-sm text-gray-500">Market research</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  
                                                  <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                                                    startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                      ? 'border-green-500'
                                                      : 'border-gray-300'
                                                  }`}>
                                                    <div className="px-4 py-5 sm:p-6">
                                                      <div className="flex items-center">
                                                        <div className={`flex-shrink-0 rounded-md p-1 ${
                                                          startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                            ? 'bg-green-100'
                                                            : 'bg-gray-100'
                                                        }`}>
                                                          <svg className={`h-5 w-5 ${
                                                            startup.status === 'MVP' || startup.status === 'LAUNCHED'
                                                              ? 'text-green-500'
                                                              : 'text-gray-400'
                                                          }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                          </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                          <h5 className="text-lg font-medium">MVP</h5>
                                                          <p className="text-sm text-gray-500">Minimum viable product</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  
                                                  <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                                                    startup.status === 'LAUNCHED'
                                                      ? 'border-green-500'
                                                      : 'border-gray-300'
                                                  }`}>
                                                    <div className="px-4 py-5 sm:p-6">
                                                      <div className="flex items-center">
                                                        <div className={`flex-shrink-0 rounded-md p-1 ${
                                                          startup.status === 'LAUNCHED'
                                                            ? 'bg-green-100'
                                                            : 'bg-gray-100'
                                                        }`}>
                                                          <svg className={`h-5 w-5 ${
                                                            startup.status === 'LAUNCHED'
                                                              ? 'text-green-500'
                                                              : 'text-gray-400'
                                                          }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                          </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                          <h5 className="text-lg font-medium">Launched</h5>
                                                          <p className="text-sm text-gray-500">Product in market</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </DashboardLayout>
                              );
                            }
                            
                            function getProgressPercentage() {
                              // This is a placeholder function - in a real app, you would calculate this based on the startup's progress
                              return '25%';
                            }