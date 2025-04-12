import { cacheService } from '../services/cacheService';
import Redis from 'ioredis';

// Mock do Redis
jest.mock('ioredis');

describe('CacheService', () => {
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configurar mock do Redis
    mockRedis = new Redis() as jest.Mocked<Redis>;
    (Redis as jest.Mock).mockImplementation(() => mockRedis);
  });

  describe('get', () => {
    it('deve retornar null quando não há dados em cache', async () => {
      mockRedis.get.mockResolvedValue(null);
      
      const result = await cacheService.get('test-key');
      
      expect(result).toBeNull();
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
    });

    it('deve retornar dados parseados quando há cache', async () => {
      const mockData = { test: 'data' };
      mockRedis.get.mockResolvedValue(JSON.stringify(mockData));
      
      const result = await cacheService.get('test-key');
      
      expect(result).toEqual(mockData);
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
    });

    it('deve retornar null em caso de erro', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));
      
      const result = await cacheService.get('test-key');
      
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('deve armazenar dados com TTL padrão', async () => {
      const data = { test: 'data' };
      
      await cacheService.set('test-key', data);
      
      expect(mockRedis.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data),
        'EX',
        3600
      );
    });

    it('deve armazenar dados com TTL personalizado', async () => {
      const data = { test: 'data' };
      const ttl = 1800;
      
      await cacheService.set('test-key', data, ttl);
      
      expect(mockRedis.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data),
        'EX',
        ttl
      );
    });
  });

  describe('getOrSet', () => {
    it('deve retornar dados do cache quando disponível', async () => {
      const mockData = { test: 'data' };
      mockRedis.get.mockResolvedValue(JSON.stringify(mockData));
      
      const fetchFn = jest.fn();
      const result = await cacheService.getOrSet('test-key', fetchFn);
      
      expect(result).toEqual(mockData);
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('deve buscar e armazenar dados quando não há cache', async () => {
      mockRedis.get.mockResolvedValue(null);
      
      const mockData = { test: 'data' };
      const fetchFn = jest.fn().mockResolvedValue(mockData);
      
      const result = await cacheService.getOrSet('test-key', fetchFn);
      
      expect(result).toEqual(mockData);
      expect(fetchFn).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(mockData),
        'EX',
        3600
      );
    });
  });
}); 