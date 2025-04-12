import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { StartupCard } from './StartupCard';
import { useToast } from '../hooks/useToast';

interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  funding: number;
  teamSize: number;
}

export function StartupList() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { addToast } = useToast();
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/startups?page=${page}&limit=10`);
      const data = await response.json();

      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      setStartups((prev) => [...prev, ...data.data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      addToast('Erro ao carregar startups', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchStartups();
    }
  }, [inView]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
      
      {hasMore && (
        <div ref={ref} className="col-span-full flex justify-center p-4">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          ) : (
            <span className="text-gray-500">Role para carregar mais</span>
          )}
        </div>
      )}
      
      {!hasMore && startups.length > 0 && (
        <div className="col-span-full text-center text-gray-500 p-4">
          Não há mais startups para carregar
        </div>
      )}
      
      {!hasMore && startups.length === 0 && (
        <div className="col-span-full text-center text-gray-500 p-4">
          Nenhuma startup encontrada
        </div>
      )}
    </div>
  );
} 