import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import MainLayout from '@/components/layouts/MainLayout';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import type { NextPage } from 'next';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    cnpj: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  
  // Track which fields have been touched/modified
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        minLength: !hasMinLength,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        numbers: !hasNumbers,
        specialChar: !hasSpecialChar,
      }
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setError('');
  };
  
  // Function to check if a field is empty and has been touched
  const isFieldInvalid = (fieldName: string): boolean => {
    return touchedFields[fieldName] && !formData[fieldName as keyof typeof formData];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched when form is submitted
    const allFields = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      cpf: true,
      cep: true,
      address: true,
      number: true,
      neighborhood: true,
      city: true,
      state: true
    };
    setTouchedFields(allFields);
    
    // Validate required fields
    const requiredFields = [
      'name', 'email', 'password', 'phone', 'cpf',
      'cep', 'address', 'number', 'neighborhood', 'city', 'state'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      setError(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          cpf: formData.cpf,
          cnpj: formData.cnpj,
          cep: formData.cep,
          address: formData.address,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503 || response.status === 504) {
          throw new Error('O servidor está temporariamente indisponível. Por favor, tente novamente em alguns minutos.');
        }
        // Melhor tratamento da mensagem de erro vinda do backend
        const errorMessage = data.message || data.error || 'Erro ao criar conta';
        console.log('Erro recebido do backend:', errorMessage);
        throw new Error(errorMessage);
      }

      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        router.push('/login?registered=true');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const validation = validatePassword(password);
    const requirements = [
      { label: 'Mínimo de 8 caracteres', met: !validation.errors.minLength },
      { label: 'Uma letra maiúscula', met: !validation.errors.upperCase },
      { label: 'Uma letra minúscula', met: !validation.errors.lowerCase },
      { label: 'Um número', met: !validation.errors.numbers },
      { label: 'Um caractere especial', met: !validation.errors.specialChar },
    ];

    return (
      <div className="mt-2 text-sm">
        <p className="text-gray-600 mb-1">Requisitos da senha:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li
              key={index}
              className={`flex items-center ${
                req.met ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <span className="mr-2">
                {req.met ? '✓' : '○'}
              </span>
              {req.label}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <MainLayout title="Criar Conta - AI Startup Creator">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              faça login em sua conta existente
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome completo *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className={`h-5 w-5 ${isFieldInvalid('name') ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${isFieldInvalid('name') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Seu nome completo"
                  />
                </div>
                {isFieldInvalid('name') && (
                  <p className="mt-1 text-sm text-red-600">Nome é obrigatório</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className={`h-5 w-5 ${isFieldInvalid('email') ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="seu@email.com"
                  />
                </div>
                {isFieldInvalid('email') && (
                  <p className="mt-1 text-sm text-red-600">Email é obrigatório</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('phone') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                {isFieldInvalid('phone') && (
                  <p className="mt-1 text-sm text-red-600">Telefone é obrigatório</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="cpf"
                    id="cpf"
                    required
                    value={formData.cpf}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('cpf') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="000.000.000-00"
                  />
                </div>
                {isFieldInvalid('cpf') && (
                  <p className="mt-1 text-sm text-red-600">CPF é obrigatório</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                  CNPJ (opcional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="cnpj"
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  CEP *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="cep"
                    id="cep"
                    required
                    value={formData.cep}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('cep') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="00000-000"
                  />
                </div>
                {isFieldInvalid('cep') && (
                  <p className="mt-1 text-sm text-red-600">CEP é obrigatório</p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Endereço *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('address') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                {isFieldInvalid('address') && (
                  <p className="mt-1 text-sm text-red-600">Endereço é obrigatório</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                    Número *
                  </label>
                  <input
                    type="text"
                    name="number"
                    id="number"
                    required
                    value={formData.number}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('number') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {isFieldInvalid('number') && (
                    <p className="mt-1 text-sm text-red-600">Número é obrigatório</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complement"
                    id="complement"
                    value={formData.complement}
                    onChange={handleChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                  Bairro *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="neighborhood"
                    id="neighborhood"
                    required
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('neighborhood') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {isFieldInvalid('neighborhood') && (
                  <p className="mt-1 text-sm text-red-600">Bairro é obrigatório</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('city') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm` focus:border-indigo-500 sm:text-sm`} focus:border-indigo-500 sm:text-sm`}
                  />
                  {isFieldInvalid('city') && (
                    <p className="mt-1 text-sm text-red-600">Cidade é obrigatória</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className={`block w-full py-2 px-3 border ${isFieldInvalid('state') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {isFieldInvalid('state') && (
                    <p className="mt-1 text-sm text-red-600">Estado é obrigatório</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className={`h-5 w-5 ${isFieldInvalid('password') ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 border ${isFieldInvalid('password') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Sua senha"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {isFieldInvalid('password') && (
                  <p className="mt-1 text-sm text-red-600">Senha é obrigatória</p>
                )}
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirme sua senha"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando conta...
                    </>
                  ) : (
                    'Criar conta'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ao se registrar, você concorda com nossos{' '}
                    <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Termos de Serviço
                    </Link>
                    {' '}e{' '}
                    <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Política de Privacidade
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;