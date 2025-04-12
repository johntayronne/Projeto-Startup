import { render, screen } from '@testing-library/react';
import { StartupCard } from '../StartupCard';

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('StartupCard', () => {
  const mockStartup = {
    id: '1',
    name: 'Startup Teste',
    description: 'Descrição da startup teste',
    industry: 'Technology',
    stage: 'MVP',
    funding: 100000,
    teamSize: 5,
  };

  it('deve renderizar as informações da startup corretamente', () => {
    render(<StartupCard startup={mockStartup} />);

    // Verifica se o nome da startup está presente
    expect(screen.getByText('Startup Teste')).toBeInTheDocument();

    // Verifica se a descrição está presente
    expect(screen.getByText('Descrição da startup teste')).toBeInTheDocument();

    // Verifica se a indústria está presente
    expect(screen.getByText('Technology')).toBeInTheDocument();

    // Verifica se o estágio está presente
    expect(screen.getByText('MVP')).toBeInTheDocument();

    // Verifica se o tamanho da equipe está presente
    expect(screen.getByText('5 pessoas')).toBeInTheDocument();

    // Verifica se o funding está presente e formatado corretamente
    expect(screen.getByText('R$ 100,000')).toBeInTheDocument();
  });

  it('deve aplicar a cor correta baseada no estágio', () => {
    render(<StartupCard startup={mockStartup} />);

    const stageElement = screen.getByText('MVP');
    expect(stageElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('deve ter uma imagem com alt text correto', () => {
    render(<StartupCard startup={mockStartup} />);

    const image = screen.getByAltText('Startup Teste');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('startup,Technology'));
  });
}); 