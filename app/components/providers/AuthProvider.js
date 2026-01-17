'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Failed to sign in with Google.');
    }
  };

  // ADDED: Email Login
  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      console.error("Email login failed:", error);
      // Firebase error messages are technical, so we simplify common ones
      if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password.');
      } else {
        toast.error('Failed to sign in.');
      }
      throw error; // Re-throw to handle UI state in the component
    }
  };

  // ADDED: Email Registration
  const registerWithEmail = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optional: Update display name immediately
      await updateProfile(userCredential.user, { displayName: name });
      
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters.');
      } else {
        toast.error('Failed to create account.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out.');
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      loginWithEmail,     // Exported
      registerWithEmail,  // Exported
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};