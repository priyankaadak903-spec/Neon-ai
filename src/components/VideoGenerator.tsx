import React, { useState } from 'react';
import { Video, Download, Share2, Sparkles, RefreshCcw, Wand2, Play, Film, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { User as FirebaseUser } from 'firebase/auth';

interface VideoGeneratorProps {
  user: FirebaseUser;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    try {
      // Stub for video generation
      await new Promise(r => setTimeout(r, 5000));
      // Realistic simulation
      setResult('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZydHZreXh6eWd4eHd4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKSjP6S7Jc9WUXe/giphy.gif');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="glass-card p-6 rounded-[32px] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan flex items-center justify-center neon-glow-blue">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Motion Flow Studio</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Neural Vision v2.0</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Scene Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the cinematic motion (e.g. 'A cybernetic panther running through a neon-lit Tokyo rain, slow motion, cinematic lighting')"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-neon-cyan/50 min-h-[150px] transition-all"
            />
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Duration & FPS</label>
              <div className="grid grid-cols-2 gap-3">
                <select className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white/70 outline-none">
                  <option>5 Seconds</option>
                  <option>10 Seconds</option>
                </select>
                <select className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white/70 outline-none">
                  <option>24 FPS</option>
                  <option>60 FPS</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Movement Style</label>
              <div className="flex gap-2">
                {['Orbit', 'Zoom', 'Pan', 'Dolly'].map((move) => (
                  <button key={move} className="flex-1 py-2 bg-white/5 border border-white/5 rounded-lg text-[10px] font-medium text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    {move}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-4 bg-neon-cyan text-cyber-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale neon-glow-blue"
          >
            {isGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {isGenerating ? 'Rendering Frames...' : 'Generate Video'}
          </button>
        </div>

        <div className="glass-card p-6 rounded-[32px] bg-neon-blue/5 border border-neon-blue/20">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-neon-blue" />
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">Multi-Pass Synthesis</h4>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Flow-based generation uses temporal consistency models to ensure smooth motion without warping. High-density compute required.
          </p>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="w-full h-full glass-main rounded-[32px] overflow-hidden flex items-center justify-center group bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]">
          {result ? (
            <div className="w-full h-full relative p-8">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group/video">
                <img src={result} alt="Generated Video" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-cyber-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                     <Play className="w-8 h-8 text-white fill-white" />
                   </div>
                </div>
              </div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-cyber-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="flex items-center gap-2 text-xs font-bold hover:text-neon-cyan transition-colors">
                  <Download className="w-5 h-5" /> MP4 High
                </button>
                <div className="w-px h-6 bg-white/10" />
                <button className="flex items-center gap-2 text-xs font-bold hover:text-neon-cyan transition-colors">
                  <Film className="w-5 h-5" /> Edit Scene
                </button>
                <div className="w-px h-6 bg-white/10" />
                <button className="flex items-center gap-2 text-xs font-bold hover:text-neon-cyan transition-colors">
                  <Share2 className="w-5 h-5" /> Deploy
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center px-10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 animate-pulse">
                <Video className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-display font-medium text-white/60 mb-2">Neural Motion Processor</h3>
              <p className="text-sm text-white/20 max-w-xs uppercase tracking-widest leading-loose">
                {isGenerating ? 'Interpreting temporal dynamics. Rendering neural flow nodes...' : 'Input scene parameters to initialize cinematic render.'}
              </p>
              {isGenerating && (
                <div className="mt-8 w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full w-2/3 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#00f2ff]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-cyber-black/80 border border-white/10 rounded-full backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Flow Engine 4.0</span>
        </div>
      </div>
    </div>
  );
};
