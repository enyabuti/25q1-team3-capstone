'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../components/Firebase';

import EmailPasswordLogin from '../../components/EmailPasswordLogin';
import PageLayout from '../../components/PageLayout';
import './login.css';

function LoginContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        router.push('/programs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push('/programs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="login-page">
        <div className="login-container">
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to continue</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            onClick={handleGoogleLogin}
            className="google-login-button"
            disabled={loading}
          >
            <img src="/google-icon.svg" alt="Google" className="google-icon" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <EmailPasswordLogin onLogin={handleEmailLogin} disabled={loading} />

          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>

          <p className="forgot-password">
            <a href="/reset-password">Forgot password?</a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}