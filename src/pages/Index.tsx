import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { user } = useAuth();

  // This component is no longer needed as the main routing is handled in App.tsx
  // But keeping it for backward compatibility
  useEffect(() => {
    if (user) {
      // User is authenticated, Dashboard will be shown
    }
  }, [user]);

  return <Dashboard />;
};

export default Index;
