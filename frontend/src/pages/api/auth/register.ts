import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { 
      name, email, password, phone, cpf, cnpj, cep, address, 
      number, complement, neighborhood, city, state 
    } = req.body;

    // Verificação de campos obrigatórios
    const requiredFields = ['name', 'email', 'password', 'phone', 'cpf', 'cep', 'address', 'number', 'neighborhood', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      console.error('Campos obrigatórios faltando:', missingFields);
      return res.status(400).json({ message: `Campos obrigatórios faltando: ${missingFields.join(', ')}` });
    }

    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('E-mail inválido:', email);
      return res.status(400).json({ message: 'E-mail inválido' });
    }

    // Verificando a URL da API no ambiente do servidor
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    if (!apiUrl) {
      console.error('A URL da API não está configurada');
      return res.status(500).json({ message: 'Erro de configuração da API' });
    }

    console.log('Tentando registrar usuário na API:', apiUrl);
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;

    // Criando o payload da requisição
    const requestBody: any = { name, email, password, phone, cpf, cep, address, number, neighborhood, city, state };
    if (cnpj) requestBody.cnpj = cnpj;
    if (complement) requestBody.complement = complement;

    // Fazendo a requisição para a API
    const response = await axios.post(`${baseUrl}/auth/register`, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    console.log('Resposta da API:', response.status);
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error && 'isAxiosError' in error) {
      console.error('Erro ao registrar usuário:', error);

      if ((error as any).code === 'ECONNREFUSED') {
        return res.status(503).json({ message: 'O servidor backend não está respondendo. Tente novamente mais tarde.' });
      }

      if ((error as any).response) {
        console.error('Erro da API:', (error as any).response?.data);
const errorMessage = (error as any).response?.data?.error || (error as any).response?.data?.message || 'Erro ao criar conta';
        return res.status(error.response.status).json({ message: errorMessage });
      }

      if (error.request) {
        console.error('Sem resposta da API');
        return res.status(504).json({ message: 'O servidor não respondeu. Tente novamente.' });
      }
    }

    console.error('Erro desconhecido:', error);
    return res.status(500).json({ message: 'Erro interno do servidor. Tente novamente mais tarde.' });
  }
}

