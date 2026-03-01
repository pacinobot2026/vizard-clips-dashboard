import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/authContext';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(session ? '/command-center' : '/login');
    }
  }, [loading, session, router]);

  return null;
}
