import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  BarChart3, 
  Users, 
  FileDown,
  LogOut,
  Activity,
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Export', href: '/export', icon: FileDown },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [indicatorY, setIndicatorY] = useState(0);
  const [showScientistDetails, setShowScientistDetails] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    // Update indicatorY based on active nav item, start from 2nd line (offset for logo)
    const activeIndex = navigation.findIndex(nav => nav.href === location.pathname);
    if (activeIndex === -1) return;
    const itemHeight = 48; // px
    const offset = 88; // leave space for logo (height + margin)
    setIndicatorY(offset + activeIndex * (itemHeight + 8)); // Include margin
  }, [location.pathname]);

  return (
    <div className="relative flex h-screen w-64 flex-col bg-gradient-to-b from-blue-800 via-green-700 to-blue-700 overflow-hidden shadow-lg">
      {/* Particle background */}
      <ParticleBackground />

      {/* Active indicator */}
      <span
        className="absolute left-0 w-1 h-12 bg-cyan-400 rounded-r-full transition-all duration-500 ease-out shadow-md"
        style={{ top: indicatorY }}
      />

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-white/10 px-6 bg-transparent">
        <img 
          src="/assets/yatrachain-logo.png" 
          alt="YatraChain" 
          className="h-12 w-auto animate-bounce-slow"
        />
        <div className="ml-3">
          <h1 className="text-lg font-bold text-white drop-shadow-lg">YatraChain</h1>
          <p className="text-sm text-white/70">Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white bg-white/10 shadow-inner hover:scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-105"
                )
              }
            >
              <item.icon className="h-5 w-5 transition-colors duration-300 group-hover:text-white" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Scientist Profile */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div 
          className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/5 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => setShowScientistDetails(!showScientistDetails)}
        >
          <Avatar className="h-10 w-10 border-2 border-cyan-400/30 animate-pulse-slow">
            <AvatarFallback className="bg-gradient-to-r from-cyan-400 via-green-300 to-blue-400 text-white font-semibold text-sm">
              PS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Dr. Priya Sharma</p>
            <p className="text-xs text-white/70 truncate">Research Scientist</p>
            <p className="text-xs text-white/50 truncate">NATPAC</p>
          </div>
        </div>

        {/* Expandable details */}
        {showScientistDetails && (
          <div className="mt-2 px-3 py-2 bg-white/10 rounded-md space-y-1 transition-all duration-300">
            <div className="flex justify-between text-xs text-white/70">
              <span>Email:</span>
              <span className="text-white">priya.sharma@natpac.gov.in</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>Phone:</span>
              <span className="text-white">+91 9876543210</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>Employee ID:</span>
              <span className="text-white">NATPAC-2024-001</span>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 hover:scale-105"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
