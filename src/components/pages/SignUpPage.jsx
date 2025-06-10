import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear auth error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(formData);
      setVerificationToken(result.verificationToken);
      setRegistrationSuccess(true);
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Success screen after registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <div className="mx-auto h-16 w-16 bg-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="font-heading text-2xl font-bold text-surface-900 mb-2">
              Account Created!
            </h2>
            
            <p className="text-surface-600 mb-6">
              We've sent a verification email to <strong>{formData.email}</strong>. 
              Please check your inbox and click the verification link to activate your account.
            </p>

            {/* Demo: Show verification token for testing */}
            <div className="bg-surface-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-surface-700 mb-2">
                Demo Mode - Verification Token:
              </p>
              <p className="text-xs font-mono bg-surface-200 p-2 rounded text-surface-800">
                {verificationToken}
              </p>
              <p className="text-xs text-surface-600 mt-2">
                In a real app, this would be sent via email
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setRegistrationSuccess(false);
                  setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
              >
                Register Another Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-surface-900">
            Create account
          </h2>
          <p className="mt-2 text-surface-600">
            Get started with your free account today
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <FormField
              label="Username"
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              placeholder="Choose a username"
              icon={User}
            />

            {/* Email Field */}
            <FormField
              label="Email address"
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="Enter your email"
              icon={Mail}
            />

            {/* Password Field */}
            <FormField
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              placeholder="Create a password"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Confirm Password Field */}
            <FormField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              placeholder="Confirm your password"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Global Error */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <p className="text-sm text-error font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-surface-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-primary hover:text-secondary transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;