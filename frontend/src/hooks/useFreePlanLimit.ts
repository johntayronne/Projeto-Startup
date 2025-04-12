import { useState, useEffect } from 'react';

interface FreePlanLimits {
  maxStartups: number;
  maxRequests: number;
  currentStartups: number;
  currentRequests: number;
}

export function useFreePlanLimit() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [limits, setLimits] = useState<FreePlanLimits>({
    maxStartups: 1,
    maxRequests: 50,
    currentStartups: 0,
    currentRequests: 0
  });

  useEffect(() => {
    // Aqui você pode carregar os limites do usuário do backend
    // Por enquanto, vamos usar valores mockados
    const loadLimits = async () => {
      try {
        // Simular chamada à API
        const response = {
          maxStartups: 1,
          maxRequests: 50,
          currentStartups: localStorage.getItem('currentStartups') ? 
            Number(localStorage.getItem('currentStartups')) : 0,
          currentRequests: localStorage.getItem('currentRequests') ? 
            Number(localStorage.getItem('currentRequests')) : 0
        };

        setLimits(response);
      } catch (error) {
        console.error('Erro ao carregar limites:', error);
      }
    };

    loadLimits();
  }, []);

  const incrementStartup = () => {
    const newCount = limits.currentStartups + 1;
    if (newCount > limits.maxStartups) {
      setShowUpgradeModal(true);
      return false;
    }
    
    setLimits(prev => ({
      ...prev,
      currentStartups: newCount
    }));
    localStorage.setItem('currentStartups', String(newCount));
    return true;
  };

  const incrementRequest = () => {
    const newCount = limits.currentRequests + 1;
    if (newCount > limits.maxRequests) {
      setShowUpgradeModal(true);
      return false;
    }
    
    setLimits(prev => ({
      ...prev,
      currentRequests: newCount
    }));
    localStorage.setItem('currentRequests', String(newCount));
    return true;
  };

  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  const getRemainingStartups = () => {
    return Math.max(0, limits.maxStartups - limits.currentStartups);
  };

  const getRemainingRequests = () => {
    return Math.max(0, limits.maxRequests - limits.currentRequests);
  };

  return {
    showUpgradeModal,
    closeUpgradeModal,
    incrementStartup,
    incrementRequest,
    getRemainingStartups,
    getRemainingRequests,
    limits
  };
} 