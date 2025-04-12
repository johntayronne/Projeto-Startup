import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import { startupService } from '@/services/api';
import { Startup } from '@/types';

export default function StartupList() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchStartups();
    }
  }, [session]);

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const fetchStartups = async () => {
    try {
      const data = await startupService.list() as Startup[];
      setStartups(data);
    } catch (err) {
      setError('Erro ao carregar as startups');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Minhas Startups - AI Startup Creator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Startups</h1>
            <p className="mt-2 text-sm text-gray-500">
              Gerencie todas as suas startups em um só lugar.
            </p>
          </div>
          <div>
            <Link
              href="/startup/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Nova Startup
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-8 text-center">Carregando startups...</div>
        ) : startups.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Você ainda não tem nenhuma startup.</p>
            <Link
              href="/startup/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
            >
              Criar Primeira Startup
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startup/${startup.id}`}
                className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">{startup.name}</h2>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{startup.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          startup.mvpStatus === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : startup.mvpStatus === 'GENERATING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {startup.mvpStatus === 'COMPLETED'
                          ? 'MVP Pronto'
                          : startup.mvpStatus === 'GENERATING'
                          ? 'Gerando MVP'
                          : 'MVP Pendente'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(startup.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 