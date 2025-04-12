import { useState } from 'react';
import { useRouter } from 'next/router';

interface Plano {
  nome: string;
  preco: string;
  recursos: string[];
  destaque?: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const planos: Plano[] = [
    {
      nome: 'Pro',
      preco: 'R$ 197/mês',
      recursos: [
        'Tudo do Free +',
        'IA avançada para planejamento',
        'Domínio personalizado',
        'Suporte prioritário 24/7',
        'Integrações premium'
      ],
      destaque: true
    },
    {
      nome: 'Enterprise',
      preco: 'Sob consulta',
      recursos: [
        'Tudo do Pro +',
        'IA dedicada',
        'Consultoria especializada',
        'SLA garantido',
        'Customizações ilimitadas'
      ]
    }
  ];

  const handleUpgrade = (plano: string) => {
    setSelectedPlan(plano);
    router.push(`/checkout?plano=${plano.toLowerCase()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Atualize seu Plano para Continuar
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-300 mb-8">
            Você atingiu o limite do plano gratuito. Escolha um plano premium para
            continuar aproveitando todos os recursos da plataforma.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {planos.map((plano) => (
              <div
                key={plano.nome}
                className={`bg-gray-800 rounded-lg p-6 ${
                  plano.destaque
                    ? 'ring-2 ring-blue-500 transform scale-105'
                    : ''
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {plano.nome}
                </h3>
                <div className="text-2xl font-bold text-blue-500 mb-4">
                  {plano.preco}
                </div>
                <ul className="space-y-3 mb-6">
                  {plano.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {recurso}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(plano.nome)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plano.destaque
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Escolher {plano.nome}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Todos os planos incluem garantia de 7 dias. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 