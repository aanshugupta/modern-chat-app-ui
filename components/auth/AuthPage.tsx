
import React, { useState } from 'react';
import { User } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import { EyeIcon, EyeOffIcon, GoogleIcon, FacebookIcon } from '../icons/Icons';

interface AuthPageProps {
  onLogin: (user: User) => void;
  mockUser: User;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, mockUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    alert('Login successful!');
    onLogin(mockUser);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful signup
    alert('Signup successful! Please log in.');
    setIsLogin(true);
  };
  
  const handleSocialLogin = (provider: string) => {
    alert(`Logging in with ${provider}...`);
    onLogin(mockUser);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <Input id="name" name="name" type="text" required placeholder="Full Name" />
          )}
          <Input id="email" name="email" type="email" required placeholder="Email address" defaultValue="alex@example.com" />
          <div className="relative">
            <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="Password" defaultValue="password" />
            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
              {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
            </button>
          </div>
          
          <Button type="submit" className="w-full">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => handleSocialLogin('Google')}>
                <GoogleIcon className="w-5 h-5" /> Google
            </Button>
            <Button variant="secondary" onClick={() => handleSocialLogin('Facebook')}>
                <FacebookIcon className="w-5 h-5" /> Facebook
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;