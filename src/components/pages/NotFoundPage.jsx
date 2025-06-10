import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertTriangle" size={32} className="text-white" />
          </div>
          
          <h1 className="font-heading text-4xl font-bold text-surface-900 mb-4">404</h1>
          <h2 className="font-heading text-xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
          <p className="text-surface-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Button 
                onClick={() => navigate('/today')}
                variant="primary"
                className="w-full"
            >
                Go to Today
            </Button>
            <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full"
            >
                Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;