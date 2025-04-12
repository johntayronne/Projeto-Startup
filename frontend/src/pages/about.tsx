import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';

export default function About() {
  return (
    <MainLayout title="Sobre - AI Startup Creator">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Sobre nós</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            AI Startup Creator
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Transformando ideias em startups de sucesso com o poder da Inteligência Artificial
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Nossa Missão</h3>
              <p className="mt-4 text-lg text-gray-500">
                Democratizar o processo de criação de startups, tornando possível para qualquer pessoa
                transformar sua ideia em um negócio viável usando tecnologia de ponta.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">Nossa Visão</h3>
              <p className="mt-4 text-lg text-gray-500">
                Ser a principal plataforma global para criação e desenvolvimento de startups,
                impulsionando a inovação e o empreendedorismo através da IA.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">Como Funciona</h3>
              <p className="mt-4 text-lg text-gray-500">
                Nossa plataforma utiliza algoritmos avançados de IA para analisar sua ideia,
                gerar modelos de negócios, criar MVPs e desenvolver estratégias de crescimento
                personalizadas.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">Tecnologia</h3>
              <p className="mt-4 text-lg text-gray-500">
                Combinamos as mais recentes tecnologias em IA e aprendizado de máquina com
                anos de experiência em empreendedorismo para oferecer soluções inovadoras.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Entre em Contato</h3>
          <p className="text-lg text-gray-500">
            Quer saber mais sobre como podemos ajudar a transformar sua ideia em realidade?
            {' '}
            <a href="/contact" className="text-indigo-600 hover:text-indigo-500">
              Entre em contato conosco
            </a>
            .
          </p>
        </div>
      </div>
    </MainLayout>
  );
} 