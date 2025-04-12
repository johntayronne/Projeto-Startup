import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Componente de Depoimento
interface Depoimento {
  nome: string;
  cargo: string;
  texto: string;
  imagem: string;
}

const depoimentos: Depoimento[] = [
  {
    nome: 'João Silva',
    cargo: 'CEO, TechStart',
    texto: 'Em apenas 2 semanas, transformei minha ideia em uma startup funcional. Incrível!',
    imagem: '/images/testimonials/joao.jpg'
  },
  {
    nome: 'Maria Santos',
    cargo: 'Fundadora, EcoInova',
    texto: 'A IA me ajudou a estruturar todo o negócio. Economizei tempo e dinheiro!',
    imagem: '/images/testimonials/maria.jpg'
  },
  {
    nome: 'Pedro Costa',
    cargo: 'CTO, FinTech Solutions',
    texto: 'A plataforma superou minhas expectativas. O MVP ficou perfeito!',
    imagem: '/images/testimonials/pedro.jpg'
  }
];

// Componente de Plano
interface Plano {
  nome: string;
  preco: string;
  recursos: string[];
  destaque?: boolean;
}

const planos: Plano[] = [
  {
    nome: 'Free',
    preco: 'R$ 0',
    recursos: [
      'Geração básica de MVP',
      'Site institucional',
      'Hospedagem gratuita',
      'Suporte por email'
    ]
  },
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

export default function Home() {
  const [currentDepoimento, setCurrentDepoimento] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: 'Como funciona a IA para criar uma startup?',
      resposta: 'Nossa IA analisa sua ideia, cria um plano de negócios detalhado e gera automaticamente toda a infraestrutura necessária, incluindo site, sistemas e documentação.'
    },
    {
      pergunta: 'Preciso de experiência técnica?',
      resposta: 'Não! Nossa plataforma foi projetada para ser totalmente automatizada. A IA cuida de toda a parte técnica por você.'
    },
    {
      pergunta: 'O que está incluso no plano Pro?',
      resposta: 'O plano Pro inclui todas as funcionalidades premium como IA avançada para planejamento, domínio personalizado, suporte 24/7 e integrações especiais.'
    },
    {
      pergunta: 'Como é feita a cobrança pelo Stripe?',
      resposta: 'A cobrança é feita mensalmente através do Stripe, uma plataforma segura de pagamentos. Você pode cancelar a qualquer momento.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Transforme sua Ideia em uma
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {' '}Startup Lucrativa
            </span>
            {' '}com IA
            </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Deixe a Inteligência Artificial cuidar de tudo: do planejamento ao MVP em questão de dias.
          </p>
          <Link
            href="/cadastro?redirect=/criar-startup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Comece Agora Gratuitamente
          </Link>
        </div>
        
        {/* Animação de partículas ou ilustração aqui */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Como Funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: '1️⃣',
                title: 'Descreva sua ideia',
                desc: 'A IA analisa e propõe um plano estratégico'
              },
              {
                icon: '2️⃣',
                title: 'Geração Automática',
                desc: 'Criação do site, estrutura e plano de negócios'
              },
              {
                icon: '3️⃣',
                title: 'Testes e MVP',
                desc: 'A IA cria um protótipo funcional do seu produto'
              },
              {
                icon: '4️⃣',
                title: 'Lançamento e Crescimento',
                desc: 'Ferramentas para escalar seu negócio'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg text-center transform hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologias Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            Tecnologias que Usamos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'OpenAI', 'Claude', 'DeepSeek', 'Firebase',
              'Stripe', 'React.js', 'Node.js', 'MongoDB'
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Benefícios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Criação Instantânea',
                desc: 'Site profissional e sistema completo em minutos'
              },
              {
                icon: '🤖',
                title: 'IA Especialista',
                desc: 'Treinada para planejar negócios do zero'
              },
              {
                icon: '☁️',
                title: 'Infraestrutura Pronta',
                desc: 'Inclui hospedagem e domínio personalizado'
              },
              {
                icon: '💰',
                title: 'Custo Reduzido',
                desc: 'Economia comparado a contratar uma equipe'
              },
              {
                icon: '⚡',
                title: 'Automação Completa',
                desc: 'Sem necessidade de experiência técnica'
              },
              {
                icon: '📈',
                title: 'Escalabilidade',
                desc: 'Ferramentas para crescer seu negócio'
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg transform hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Planos e Preços
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {planos.map((plano, index) => (
              <div
                key={index}
                className={`bg-gray-900 rounded-lg p-8 ${
                  plano.destaque
                    ? 'transform scale-105 border-2 border-blue-500'
                    : ''
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{plano.nome}</h3>
                <div className="text-3xl font-bold text-blue-500 mb-6">
                  {plano.preco}
                </div>
                <ul className="space-y-4 mb-8">
                  {plano.recursos.map((recurso, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <span className="mr-2">✓</span>
                      {recurso}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/cadastro?redirect=/checkout?plano=${plano.nome.toLowerCase()}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Começar Agora
                </Link>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            O que Dizem Nossos Usuários
          </h2>
          <div className="relative">
            <div className="bg-gray-800 rounded-lg p-8">
              <p className="text-xl text-gray-300 mb-6">
                "{depoimentos[currentDepoimento].texto}"
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={depoimentos[currentDepoimento].imagem}
                    alt={depoimentos[currentDepoimento].nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-white">
                    {depoimentos[currentDepoimento].nome}
                  </div>
                  <div className="text-gray-400">
                    {depoimentos[currentDepoimento].cargo}
                  </div>
          </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {depoimentos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDepoimento(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentDepoimento === index ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left text-white font-medium flex justify-between items-center"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  {faq.pergunta}
                  <span className={`transform transition-transform ${
                    faqOpen === index ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                {faqOpen === index && (
                  <div className="px-6 py-4 text-gray-300">
                    {faq.resposta}
              </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Pronto para Transformar sua Ideia em Realidade?
          </h2>
          <Link
            href="/cadastro?redirect=/criar-startup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Comece sua Jornada Agora
          </Link>
        </div>
      </section>

      {/* Botão de Suporte */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transform hover:scale-105 transition-all">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 