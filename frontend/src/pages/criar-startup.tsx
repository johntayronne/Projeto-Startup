import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CriarStartup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ideia: '',
    mercadoAlvo: '',
    problema: '',
    solucao: '',
    diferencial: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar startup');
      }

      const data = await response.json();
      router.push(`/dashboard/startup/${data.id}`);
    } catch (err) {
      setError('Ocorreu um erro ao criar sua startup. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🚀 Criar Nova Startup
        </h1>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Descreva sua ideia de startup
              </label>
              <textarea
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={4}
                value={formData.ideia}
                onChange={(e) => setFormData({ ...formData, ideia: e.target.value })}
                placeholder="Ex: Um aplicativo que usa IA para criar planos de dieta personalizados..."
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Qual é o mercado-alvo?
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.mercadoAlvo}
                onChange={(e) => setFormData({ ...formData, mercadoAlvo: e.target.value })}
                placeholder="Ex: Pessoas interessadas em saúde e bem-estar..."
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Qual problema você está resolvendo?
              </label>
              <textarea
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                value={formData.problema}
                onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                placeholder="Ex: Dificuldade em manter uma dieta saudável..."
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Como sua solução resolve esse problema?
              </label>
              <textarea
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                value={formData.solucao}
                onChange={(e) => setFormData({ ...formData, solucao: e.target.value })}
                placeholder="Ex: Usando IA para criar planos personalizados..."
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Qual é seu diferencial competitivo?
              </label>
              <textarea
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                value={formData.diferencial}
                onChange={(e) => setFormData({ ...formData, diferencial: e.target.value })}
                placeholder="Ex: Algoritmo único de IA que considera múltiplos fatores..."
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Criando sua startup...' : 'Criar Startup com IA'}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Como funciona?</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>Preencha o formulário com sua ideia de startup</li>
            <li>Nossa IA analisará sua proposta e gerará:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Análise de viabilidade</li>
              <li>Plano de negócios inicial</li>
              <li>Sugestões de MVP</li>
              <li>Análise de mercado</li>
            </ul>
            <li>Receba um dashboard completo com próximos passos</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 