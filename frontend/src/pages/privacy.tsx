import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';

export default function Privacy() {
  return (
    <MainLayout title="Política de Privacidade - AI Startup Creator">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Política de Privacidade
          </h1>

          <div className="prose prose-indigo max-w-none">
            <p className="text-lg text-gray-500 mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introdução
              </h2>
              <p className="text-gray-600 mb-4">
                A AI Startup Creator está comprometida em proteger sua privacidade. Esta política
                descreve como coletamos, usamos e protegemos suas informações pessoais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Informações que Coletamos
              </h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Informações de cadastro (nome, email, senha)</li>
                <li>Dados de uso da plataforma</li>
                <li>Informações sobre suas startups e projetos</li>
                <li>Dados de pagamento (processados de forma segura por terceiros)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Como Usamos suas Informações
              </h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Para fornecer e melhorar nossos serviços</li>
                <li>Para personalizar sua experiência</li>
                <li>Para processar pagamentos</li>
                <li>Para comunicação sobre atualizações e novidades</li>
                <li>Para garantir a segurança da plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-gray-600 mb-4">
                Não vendemos suas informações pessoais. Compartilhamos dados apenas quando:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Você autorizar explicitamente</li>
                <li>For necessário para prestação do serviço</li>
                <li>For exigido por lei</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Segurança dos Dados
              </h2>
              <p className="text-gray-600 mb-4">
                Implementamos medidas técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Criptografia de dados sensíveis</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Seus Direitos
              </h2>
              <p className="text-gray-600 mb-4">
                Você tem direito a:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento para uso dos dados</li>
                <li>Receber seus dados em formato portável</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Contato
              </h2>
              <p className="text-gray-600 mb-4">
                Para questões sobre privacidade, entre em contato:
              </p>
              <ul className="list-none text-gray-600 space-y-2">
                <li>Email: privacy@aistartup.com</li>
                <li>Telefone: (11) 1234-5678</li>
                <li>
                  <a href="/contact" className="text-indigo-600 hover:text-indigo-500">
                    Formulário de Contato
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 