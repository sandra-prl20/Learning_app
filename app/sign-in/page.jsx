'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0); // Track login attempts
  const [signInWithEmailAndPassword, user, loading, fbError] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    setError('');  // Clear previous errors

    // Validation for empty fields
    if (!email && !password) {
      setError('Please enter username and password.');
      return;
    } else if (!email) {
      setError('Please enter username.');
      return;
    } else if (!password) {
      setError('Please enter password.');
      return;
    }

    try {
      // Attempt to sign in with email and password
      const res = await signInWithEmailAndPassword(email, password);
      
      if (res?.user) {
        // Reset attempts on successful login
        setAttempts(0);
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        router.push('/crud'); // Redirect to the CRUD operations page
      }
    } catch (error) {
      // Increment attempt counter and set error message
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {  // Third attempt failed
        setError('Too many failed attempts. Please try again later.');
      } else {
        // Handle different error codes from Firebase
        if (fbError?.code === 'auth/user-not-found') {
          setError('Username does not match any registered account.');
        } else if (fbError?.code === 'auth/wrong-password') {
          setError('Password does not match. Please try again.');
        } else {
          setError('Failed to sign in. Please check your credentials.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-cyan-900 font-bold text-2xl mb-5">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-white"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-white"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-black rounded text-white hover:bg-sky-600"
          disabled={attempts >= 3}  // Disable button after 3 failed attempts
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignIn;
