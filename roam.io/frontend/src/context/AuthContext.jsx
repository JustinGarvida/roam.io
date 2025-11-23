import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/auth";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      // Get current session (if user is already logged in)
      const { data, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) {
        console.error("Error getting session:", error);
        setUser(null);
      } else {
        console.log("Initial session:", data.session);
        setUser(data.session?.user ?? null);
      }
      setInitializing(false);
    };

    initAuth();

    // Listen for login / logout / token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      console.log("Auth state changed, session:", session);
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = { user, logout };

  if (initializing) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
