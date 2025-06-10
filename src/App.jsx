import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/components/pages/LoginPage';
import SignUpPage from '@/components/pages/SignUpPage';
import { routeArray, routes } from './config/routes';

function App() {
return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {routeArray.map(route => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route path="*" element={<routes.notFound.component />} />
          </Route>
        </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        toastClassName="bg-white shadow-lg border border-surface-200 rounded-lg"
        progressClassName="bg-primary"
/>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App