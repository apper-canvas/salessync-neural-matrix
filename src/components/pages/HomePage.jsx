import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to today view which is the main entry point
    navigate('/today', { replace: true });
  }, [navigate]);

  return null;
};

export default HomePage;