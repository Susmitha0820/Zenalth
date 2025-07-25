
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !isFirebaseConfigured) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  if (!isFirebaseConfigured) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
            <Card className="w-full max-w-lg border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle /> Firebase Not Configured
                    </CardTitle>
                    <CardDescription>
                       Your application is missing the required Firebase environment variables.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                   <p>To enable user authentication and run the app, you need to add your Firebase project credentials to the <code className="bg-muted px-1 py-0.5 rounded-sm">.env</code> file in the root of this project.</p>
                   <p>Please refer to the <code className="bg-muted px-1 py-0.5 rounded-sm">README.md</code> or Firebase documentation for instructions on how to obtain these keys.</p>
                </CardContent>
            </Card>
        </div>
      );
  }


  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (!user && !isAuthPage) {
    return null; // or a minimal loading state, as the redirect will happen
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
