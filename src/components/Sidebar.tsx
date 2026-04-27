import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Mic2, 
  FileText, 
  Layout, 
  History, 
  Heart,
  LogOut,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'image', label: 'Image Generator', icon: ImageIcon },
  { id: 'video', label: 'Video Generator', icon: Video },
  { id: 'music', label: 'Music Generator', icon: Music },
  { id: 'voice', label: 'Voice Clone', icon: Mic2 },
  { id: 'docs', label: 'Documents', icon: FileText },
  { id: 'templates', label: 'Templates', icon: Layout },
  { id: 'history', label: 'History', icon: History },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <div className={cn(
        "fixed lg:relative w-64 h-screen glass-main flex flex-col p-4 z-50 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between mb-10 px-2 lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl flex items-center justify-center neon-glow-purple">
              <Zap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              NEON <span className="text-neon-cyan">CODE</span>
            </h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-white/40">
            <Zap className="w-5 h-5 rotate-180" />
          </button>
        </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
              activeTab === item.id 
                ? "bg-white/10 text-white border border-white/5 shadow-inner" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeTab === item.id ? "text-neon-cyan" : "group-hover:text-neon-blue"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f2ff]"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {/* Pro Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-white/10 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-sm font-bold mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-white/60 mb-3">Get unlimited access to all AI models.</p>
            <button className="w-full py-2 bg-white text-cyber-black text-xs font-bold rounded-lg hover:bg-neon-cyan transition-colors">
              Upgrade Now
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-neon-purple/20 blur-2xl group-hover:bg-neon-blue/40 duration-700 pointer-events-none" />
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-white/60" />
            <span className="text-xs font-medium">Dark Mode</span>
          </div>
          <button className="w-8 h-4 bg-neon-blue/40 rounded-full relative p-0.5">
            <div className="w-3 h-3 bg-white rounded-full ml-auto" />
          </button>
        </div>

        <button className="flex items-center gap-3 px-3 py-3 w-full text-white/50 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
    </>
  );
};
