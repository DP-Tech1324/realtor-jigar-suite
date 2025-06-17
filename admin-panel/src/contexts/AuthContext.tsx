import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isAgent: boolean;
  userRole: string | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsAdmin(false);
      setIsAgent(false);
      setUserRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAdmin');
      return;
    }

    try {
      console.log('🔄 Refreshing profile for user:', user.id);

      const { data: roleData, error: roleError } = await supabase.rpc('get_current_user_role');
      console.log('DEBUG: get_current_user_role returned:', { roleData, roleError, userId: user?.id });

      if (roleError || !roleData) {
        console.error('❌ Role fetch error:', roleError);

        // Graceful fallback using localStorage
        const fallbackRole = localStorage.getItem('userRole');
        const fallbackAdmin = localStorage.getItem('isAdmin') === 'true';

        if (fallbackRole) {
          console.warn('⚠️ Using fallback from localStorage');
          setUserRole(fallbackRole);
          setIsAdmin(fallbackAdmin);
          return;
        }

        setIsAdmin(false);
        setUserRole(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdmin');
        return;
      }
      
      const role = roleData;
      const adminStatus = ['admin', 'superadmin', 'editor'].includes(role);

      console.log('🔍 User role:', role);
      console.log('🔐 Is Admin:', adminStatus);

      setUserRole(role);
      setIsAdmin(adminStatus);
      setIsAgent(false);

      localStorage.setItem('userRole', role);
      localStorage.setItem('isAdmin', adminStatus.toString());

      if (adminStatus) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (!adminError && adminData) {
          setProfile(adminData);
        }
      }
    } catch (error) {
      console.error('❌ Error in refreshProfile:', error);
      setIsAdmin(false);
      setIsAgent(false);
      setUserRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAdmin');
    }
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        console.log('🔔 Auth state changed:', _event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(() => refreshProfile(), 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsAgent(false);
          setUserRole(null);
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAdmin');
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('🟢 Initial session:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const savedRole = localStorage.getItem('userRole');
        const savedAdmin = localStorage.getItem('isAdmin') === 'true';

        if (savedRole) {
          setUserRole(savedRole);
          setIsAdmin(savedAdmin);
        }

        await refreshProfile();
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
        return { success: false, error: error.message };
      }

      toast({ title: "Signed in successfully", description: "Welcome back!" });
      return { success: true };
    } catch (error: any) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        return { success: false, error: error.message };
      }

      toast({ title: "Sign up successful", description: "Please check your email to verify your account." });
      return { success: true };
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsAgent(false);
    setUserRole(null);
    setProfile(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    toast({ title: "Signed out", description: "You have been signed out successfully." });
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      isAdmin,
      isAgent,
      userRole,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
