import React from 'react';
import { 
  Zap, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Music, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Quote,
  FileText,
  Search,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardProps {
  onToolClick: (tool: string) => void;
}

const popularTools = [
  { id: 'chat', name: 'AI Chat', desc: 'Smarter conversations with Gemini 3.1 Pro', icon: MessageSquare, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
  { id: 'image', name: 'Image Gen', desc: 'Create stunning visuals with simple text', icon: ImageIcon, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
  { id: 'video', name: 'Video Maker', desc: 'Generate high-quality cinematic videos', icon: Video, color: 'text-neon-pink', bg: 'bg-neon-pink/10' },
  { id: 'music', name: 'Music Studio', desc: 'Compose original tracks and soundscapes', icon: Music, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
];

const recentCreations = [
  { title: 'Cyberpunk City', type: 'Image', url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=400' },
  { title: 'Neon Forest', type: 'Video', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400' },
  { title: 'Future Beats', type: 'Music', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400' },
  { title: 'AI Logic', type: 'Doc', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onToolClick }) => {
  return (
    <div className="flex gap-8 h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
      <div className="flex-1 space-y-8">
        {/* Welcome Banner */}
        <section className="relative p-10 rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-neon-blue/20 to-transparent z-0" />
          <div className="absolute inset-0 border border-white/10 rounded-[32px] z-10" />
          
          <div className="relative z-20 flex justify-between items-center">
            <div className="max-w-md">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-display font-bold mb-4"
              >
                Welcome back, <span className="neon-text-gradient">NEON ELITE</span> 👋
              </motion.h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Unlock the full potential of artificial intelligence. Your creative workspace is ready for action.
              </p>
              <button 
                onClick={() => onToolClick('chat')}
                className="px-8 py-3.5 bg-white text-cyber-black font-bold rounded-2xl flex items-center gap-2 hover:bg-neon-cyan hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Launch Console <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="hidden lg:block relative mr-10">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full blur-3xl opacity-30 animate-pulse"
              />
              <Zap className="w-40 h-40 text-neon-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_20px_rgba(110,127,243,0.5)]" />
            </div>
          </div>
        </section>

        {/* Input Box */}
        <section className="glass-card p-2 rounded-3xl group border-neon-blue/20 hover:border-neon-blue/40 transition-all">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex-1 flex items-center gap-3">
              <Search className="w-5 h-5 text-white/20" />
              <input 
                type="text" 
                placeholder="Initialize global command... (e.g. 'Build a neural network in Python')" 
                className="w-full bg-transparent border-none focus:ring-0 py-4 text-lg font-medium placeholder:text-white/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onToolClick('image')} className="hidden sm:flex p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-neon-purple transition-all"><ImageIcon className="w-5 h-5" /></button>
              <button onClick={() => onToolClick('video')} className="hidden sm:flex p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-neon-blue transition-all"><Video className="w-5 h-5" /></button>
              <button onClick={() => onToolClick('chat')} className="px-6 py-2.5 bg-neon-blue text-white rounded-xl font-bold hover:neon-glow-blue transition-all">Execute</button>
            </div>
          </div>
        </section>

        {/* Popular Tools */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-cyan" />
              <h3 className="text-xl font-display font-bold">Recommended Modules</h3>
            </div>
            <button className="text-xs font-bold text-neon-blue hover:underline uppercase tracking-widest">View Archives</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTools.map((tool, i) => (
              <motion.button 
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onToolClick(tool.id)}
                className="glass-card p-6 flex flex-col items-start text-left group hover:-translate-y-2 transition-all duration-500 border-white/5 hover:border-white/20"
              >
                <div className={cn("p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg", tool.bg)}>
                  <tool.icon className={cn("w-6 h-6", tool.color)} />
                </div>
                <h4 className="font-bold mb-1 text-white/90">{tool.name}</h4>
                <p className="text-xs text-white/30 leading-relaxed">{tool.desc}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Live Network Feed */}
        <section className="glass-card p-6 rounded-[32px] font-mono overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-neon-cyan">Neural Trace: Active</h3>
            </div>
            <span className="text-[10px] text-white/20">UUID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
          <div className="space-y-1.5 h-32 overflow-hidden text-[10px] text-white/40 leading-[1.2]">
            <div className="flex gap-4"><span className="text-neon-purple">[SYS]</span><span>Mounting encrypted partitions...</span></div>
            <div className="flex gap-4"><span className="text-neon-blue">[NET]</span><span>Linking with decentralized GPU clusters...</span></div>
            <div className="flex gap-4"><span className="text-neon-cyan">[VOD]</span><span>Streaming 4K temporal frames to flow_buffer...</span></div>
            <div className="flex gap-4"><span className="text-neon-pink">[IMG]</span><span>Refining latent space vectors for node_82...</span></div>
            <div className="flex gap-4"><span className="text-gray-500">[SEC]</span><span>Kernel integrity: 100% Verified.</span></div>
            <div className="flex gap-4"><span className="text-neon-blue">[NET]</span><span>Web search grounding enabled (Google AI Search).</span></div>
            <div className="flex gap-4"><span className="text-neon-purple">[SYS]</span><span>All neural modules responsive. Ready for instruction.</span></div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cyber-dark to-transparent pointer-events-none" />
        </section>

        {/* Recent Creations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold">Temporal Artifacts</h3>
            <button className="p-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-xs font-bold uppercase tracking-widest">Gallery</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentCreations.map((item, idx) => (
              <div key={idx} className="glass-card overflow-hidden group cursor-pointer border-white/5 hover:border-white/10 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-cyber-black/80 backdrop-blur-md rounded-md text-[9px] font-bold text-white uppercase tracking-wider">
                    {item.type}
                  </div>
                </div>
                <div className="p-4 bg-white/5">
                  <h4 className="text-sm font-bold truncate text-white/80">{item.title}</h4>
                  <p className="text-[10px] text-white/20 uppercase mt-1 tracking-widest font-mono">2026.04.27 // CR-92</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 space-y-8 hidden xl:block">
        <section className="glass-card p-6 rounded-[32px] border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-sm uppercase tracking-widest">Neural Load</h3>
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
          </div>
          
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
              <circle className="text-neon-cyan" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="75.36" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight">70%</span>
              <span className="text-[9px] text-white/40 uppercase font-bold">Synchronized</span>
            </div>
          </div>

          <div className="space-y-4">
               {[
                 { name: 'Core Processing', val: 92, color: 'bg-neon-blue' },
                 { name: 'Image synthesis', val: 45, color: 'bg-neon-purple' },
                 { name: 'Temporal Flow', val: 28, color: 'bg-neon-cyan' },
               ].map((cat, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider mb-1.5 opacity-40">
                     <span>{cat.name}</span>
                     <span>{cat.val}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${cat.val}%` }} />
                   </div>
                 </div>
               ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest px-1 opacity-40">Quick Execution</h3>
          {[
            { id: 'chat', label: 'New Neural Uplink', icon: Plus },
            { id: 'image', label: 'Synthesize Artwork', icon: ImageIcon },
            { id: 'video', label: 'Render Cinema Flow', icon: Video },
          ].map((act, i) => (
            <button 
              key={i} 
              onClick={() => onToolClick(act.id)}
              className="w-full glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group border-white/5 hover:border-neon-blue/20"
            >
              <div className="flex items-center gap-3">
                <act.icon className="w-5 h-5 text-neon-blue group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">{act.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-neon-cyan transition-colors" />
            </button>
          ))}
        </section>

        <section className="glass-card p-8 rounded-[32px] relative overflow-hidden border-white/5">
          <Quote className="w-12 h-12 text-neon-blue/10 absolute -top-2 -left-2 rotate-12" />
          <p className="text-xs italic text-white/60 leading-relaxed relative z-10 font-medium">
            "The synthetic intelligence is not a replacement for human creativity, but a multiplier that allows us to build worlds previously thought impossible."
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-4 h-px bg-neon-blue/40" />
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Neon Overlord</span>
          </div>
        </section>
      </aside>
    </div>
  );
};
