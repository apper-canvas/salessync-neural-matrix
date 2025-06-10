import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mainRoutes = routeArray.filter(route => 
    ['today', 'tasks', 'meetings', 'team'].includes(route.id)
  );

  const isActiveRoute = (path) => {
    if (path === '/today' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={16} className="text-white" />
              </div>
              <h1 className="font-heading font-bold text-xl text-secondary">SalesSync</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-surface-50 rounded-lg px-3 py-2">
              <ApperIcon name="Search" size={16} className="text-surface-500" />
              <input
                type="text"
                placeholder="Search tasks and meetings..."
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SM</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-60 bg-surface-50 border-r border-surface-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-1">
            {mainRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                  ${isActiveRoute(route.path) || isActive
                    ? 'bg-primary text-white shadow-sm border-l-4 border-accent' 
                    : 'text-surface-700 hover:bg-white hover:text-primary hover:scale-102'
                  }
                `}
              >
                <ApperIcon 
                  name={route.icon} 
                  size={18} 
                  className={isActiveRoute(route.path) ? 'text-white' : 'text-surface-500 group-hover:text-primary'}
                />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-surface-200">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white">
              <h3 className="font-heading font-semibold text-sm">Pro Tip</h3>
              <p className="text-xs mt-1 opacity-90">Use Ctrl+N to quickly add a new task</p>
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="md:hidden fixed left-0 top-16 bottom-0 w-60 bg-surface-50 border-r border-surface-200 z-50"
              >
                <nav className="p-4 space-y-1">
                  {mainRoutes.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                        ${isActiveRoute(route.path) || isActive
                          ? 'bg-primary text-white border-l-4 border-accent' 
                          : 'text-surface-700 hover:bg-white hover:text-primary'
                        }
                      `}
                    >
                      <ApperIcon name={route.icon} size={18} />
                      <span className="font-medium">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-surface-200 z-40">
        <nav className="flex">
          {mainRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) => `
                flex-1 flex flex-col items-center py-2 px-1 transition-colors
                ${isActiveRoute(route.path) || isActive
                  ? 'text-primary' 
                  : 'text-surface-500'
                }
              `}
            >
              <ApperIcon name={route.icon} size={20} />
              <span className="text-xs mt-1 font-medium">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;