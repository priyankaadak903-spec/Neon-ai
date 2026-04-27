import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, ShieldCheck, Menu, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { User as FirebaseUser } from 'firebase/auth';
import { logout } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  onMenuClick?: () => void;
  user: FirebaseUser;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="h-20 flex items-center justify-between px-4 lg:px-8 z-40 bg-cyber-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        
        <div className="relative w-40 md:w-64 lg:w-96 group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-neon-cyan transition-colors" />
          <input 
            type="text" 
            placeholder="Neural Search..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2 lg:gap-3">
          <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors relative">
            <Bell className="w-5 h-5 text-white/70" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full border-2 border-cyber-black" />
          </button>
          <button className="hidden sm:block p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="h-8 w-px bg-white/10 mx-1 lg:mx-2" />

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 lg:gap-4 p-1 rounded-2xl hover:bg-white/5 transition-all group"
          >
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-semibold">{user.displayName || 'Neon User'}</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neon-purple/20 border border-neon-purple/30 rounded-full">
                <ShieldCheck className="w-3 h-3 text-neon-purple" />
                <span className="text-[10px] font-bold text-neon-purple uppercase tracking-wider">PRO</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan p-0.5 neon-glow-blue cursor-pointer relative">
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-cyber-black flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-white font-bold text-sm">{user.displayName?.charAt(0) || 'U'}</div>
                )}
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform hidden sm:block", isProfileOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-64 glass-main rounded-2xl p-2 z-50 border border-white/10 shadow-2xl"
              >
                <div className="p-4 border-b border-white/5 space-y-1">
                  <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
                <div className="p-2 space-y-1">
                   <button className="w-full flex items-center gap-3 p-3 text-sm rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                    <ShieldCheck className="w-4 h-4 text-neon-purple" /> Security
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-sm rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                    <Settings className="w-4 h-4 text-neon-cyan" /> Settings
                  </button>
                </div>
                <div className="p-2 border-t border-white/5">
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 p-3 text-sm rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
