import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear auth error when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
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
      await login(formData);
      toast.success('Welcome back!');
      
      // Redirect to intended page or home
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-surface-900">
            Welcome back
          </h2>
          <p className="mt-2 text-surface-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="space-y-1">
              <FormField
                label="Password"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                placeholder="Enter your password"
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
            </div>

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
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-surface-50 rounded-lg">
            <p className="text-sm font-medium text-surface-700 mb-2">Demo Account:</p>
            <p className="text-xs text-surface-600">
              Email: demo@example.com<br />
              Password: password
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-surface-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-primary hover:text-secondary transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;