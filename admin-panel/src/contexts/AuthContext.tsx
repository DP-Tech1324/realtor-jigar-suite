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

  const clearRole = () => {
    setProfile(null);
    setIsAdmin(false);
    setIsAgent(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
  };

  // Look up the staff role for this user. Takes the user explicitly so it never runs
  // against a stale (signed-out) value from an earlier render.
  const resolveRole = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      clearRole();
      return;
    }
    const { data: role, error } = await supabase.rpc('get_current_user_role');
    if (error || !role) {
      console.error('Role lookup failed:', error);
      // Keep a role saved for this same user if the lookup is only temporarily failing
      const saved = localStorage.getItem('userRole');
      if (saved) {
        setUserRole(saved);
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
      } else {
        clearRole();
      }
      return;
    }

    const adminStatus = ['admin', 'superadmin', 'editor'].includes(role);
    setUserRole(role);
    setIsAdmin(adminStatus);
    setIsAgent(false);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAdmin', String(adminStatus));

    if (adminStatus) {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_active', true)
        .maybeSingle();
      setProfile(data ?? null);
    } else {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await resolveRole(data.session?.user ?? null);
  }, [resolveRole]);

  useEffect(() => {
    // Whose role is loaded; token refreshes for the same user don't reload it
    let loadedFor: string | null | undefined;

    // INITIAL_SESSION fires on subscribe, so this also covers page load.
    // No awaiting inside the callback (supabase-js holds its auth lock there); the role
    // lookup runs just after, and the app shows "loading" until it is known.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      const currentUser = currentSession?.user ?? null;
      setSession(currentSession);
      setUser(currentUser);

      const id = currentUser?.id ?? null;
      if (id === loadedFor) return;
      loadedFor = id;
      setIsLoading(true);
      setTimeout(async () => {
        await resolveRole(currentUser);
        if (loadedFor === id) setIsLoading(false);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [resolveRole]);

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
