
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldOff } from 'lucide-react';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authBypassed: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, authBypassed: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const authBypassed = !isFirebaseConfigured;

  useEffect(() => {
    if (authBypassed) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Skipped",
        description: "Firebase is not configured. You can use the app, but user data won't be saved.",
        duration: 8000
      });
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authBypassed, toast]);

  useEffect(() => {
    if (loading || authBypassed) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/');
    }
  }, [user, loading, pathname, router, authBypassed]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
    );
  }

  // If Firebase is configured, but user is not logged in on a protected page,
  // we return null to avoid flashing content while redirect happens.
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (!authBypassed && !user && !isAuthPage) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, loading, authBypassed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
