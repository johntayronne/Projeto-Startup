import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import MainLayout from '@/components/layouts/MainLayout';
import { startupService, aiService } from '@/services/api';
import { Startup } from '@/types';

export default function StartupDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchStartupDetails(id);
    }
  }, [id]);

  if (status === 'loading' || !id) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const fetchStartupDetails = async (startupId: string) => {
    try {
      const data = await startupService.getById(startupId) as Startup;
      setStartup(data);
    } catch (err) {
      setError('Erro ao carregar os detalhes da startup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMVP = async () => {
    if (!startup) return;
    
    setIsGenerating(true);
    try {
      await startupService.generateMVP(startup.id);
      await fetchStartupDetails(startup.id);
    } catch (err) {
      setError('Erro ao gerar o MVP');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBusinessModel = async () => {
    if (!startup) return;
    
    setIsGenerating(true);
    try {
      await aiService.generateBusinessModel(startup.id);
      await fetchStartupDetails(startup.id);
    } catch (err) {
      setError('Erro ao gerar o modelo de negócios');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWebsite = async () => {
    if (!startup) return;
    
    setIsGenerating(true);
    try {
      await aiService.generateWebsite(startup.id);
      await fetchStartupDetails(startup.id);
    } catch (err) {
      setError('Erro ao gerar o website');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!startup) {
    return (
      <MainLayout title="Startup não encontrada">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Startup não encontrada</h2>
            <p className="mt-4 text-gray-500">A startup que você está procurando não existe.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${startup.name} - AI Startup Creator`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{startup.name}</h1>
            <p className="mt-2 text-sm text-gray-500">{startup.description}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Modelo de Negócios</h2>
            {startup.businessModel ? (
              <div className="mt-4 prose prose-sm max-w-none">
                <p>{startup.businessModel}</p>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={handleGenerateBusinessModel}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Modelo de Negócios'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">MVP</h2>
            <div className="mt-4">
              {startup.mvpStatus === 'COMPLETED' ? (
                <div className="text-green-600">MVP gerado com sucesso!</div>
              ) : startup.mvpStatus === 'GENERATING' ? (
                <div className="text-yellow-600">Gerando MVP...</div>
              ) : (
                <button
                  onClick={handleGenerateMVP}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar MVP'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Website</h2>
            <div className="mt-4">
              {startup.websiteUrl ? (
                <a
                  href={startup.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Visitar Website
                </a>
              ) : (
                <button
                  onClick={handleGenerateWebsite}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Website'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 