import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { MatrixBackground } from './components/MatrixBackground';
import { Layout, ShieldCheck, Mail, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center p-6 relative overflow-hidden">
        <MatrixBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-cyber-black pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md glass-main p-8 lg:p-10 rounded-[40px] border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-purple/20 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-neon-cyan/20 blur-[100px]" />

          <div className="relative z-10 text-center space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-blue rounded-[24px] flex items-center justify-center neon-glow-purple group hover:scale-110 transition-transform duration-500">
                <Zap className="text-white w-10 h-10 group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold tracking-tight">NEON <span className="text-neon-cyan">CODE</span></h1>
                <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium mt-1">Neural Core Operating Network</p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => signInWithGoogle()}
                className="w-full py-4 bg-white text-cyber-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-neon-cyan transition-all group"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" /> 
                Sign in with Google
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Secure Access Protocol</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all opacity-50 cursor-not-allowed">
                   <Mail className="w-5 h-5 text-white/50" />
                </button>
                <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all opacity-50 cursor-not-allowed">
                   <Layout className="w-5 h-5 text-white/50" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs text-white/30 px-6 leading-relaxed">
                By entering the neural network, you agree to our <span className="text-white/60 underline cursor-pointer">Protocol Terms</span> and <span className="text-white/60 underline cursor-pointer">Encryption Standards</span>.
              </p>
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-neon-purple/10 border border-neon-purple/20 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-neon-purple" />
                <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">Quantum Encryption Enabled</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex bg-cyber-black min-h-screen text-white font-sans overflow-hidden relative">
      <MatrixBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-cyber-black pointer-events-none" />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} user={user} />
        
        <div className="flex-1 overflow-hidden p-4 lg:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <Dashboard onToolClick={(tool) => setActiveTab(tool)} />}
              {activeTab === 'chat' && <ChatInterface user={user} />}
              {activeTab === 'image' && <ImageGenerator user={user} />}
              {activeTab === 'video' && <VideoGenerator user={user} />}
              
              {!['dashboard', 'chat', 'image', 'video'].includes(activeTab) && (
                <div className="h-full glass-main rounded-[32px] flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/5 animate-pulse">
                    <Zap className="w-12 h-12 text-white/20" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">Access Locked</h2>
                  <p className="text-white/40 max-w-sm leading-relaxed mb-8">
                    The <span className="text-neon-cyan capitalize">{activeTab.replace('-', ' ')}</span> module is currently restricted. Upgrade to <span className="text-neon-purple font-bold">NEON PRO</span> to bypass neural limiters.
                  </p>
                  <button className="px-8 py-3 bg-neon-purple text-white font-bold rounded-2xl neon-glow-purple hover:scale-105 transition-all">
                    Upgrade Protocol
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Decorative background lights */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-neon-purple/10 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-neon-cyan/10 blur-[120px] pointer-events-none" />
        </div>
      </main>
    </div>
  );
}
