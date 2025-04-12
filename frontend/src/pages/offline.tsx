import Head from 'next/head';
import { WifiOff } from 'lucide-react';

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline - Startup Validator</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <WifiOff className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Você está offline
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Verifique sua conexão com a internet e tente novamente.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 