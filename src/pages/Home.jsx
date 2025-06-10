import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to today view which is the main entry point
    navigate('/today', { replace: true });
  }, [navigate]);

  return null;
};

export default Home;