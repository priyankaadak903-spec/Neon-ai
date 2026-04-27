import React, { useState } from 'react';
import { Image as ImageIcon, Download, Share2, Sparkles, RefreshCcw, Wand2, Hexagon } from 'lucide-react';
import { motion } from 'motion/react';
import { generateImage } from '../services/geminiService';
import { cn } from '../lib/utils';

import { User as FirebaseUser } from 'firebase/auth';

interface ImageGeneratorProps {
  user: FirebaseUser;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    try {
      const imageUrl = await generateImage(prompt);
      setResult(imageUrl);
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
            <div className="w-10 h-10 rounded-xl bg-neon-purple flex items-center justify-center neon-glow-purple">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Image Gen Studio</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Pixel Engine v4.2</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Prompt Interface</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision (e.g. 'A futuristic modular house on Mars at sunset, architectural render')"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-neon-purple/50 min-h-[150px] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Aspect Ratio</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white/70 outline-none">
                <option>1:1 Square</option>
                <option>16:9 Cinema</option>
                <option>4:5 Portrait</option>
                <option>21:9 UltraWide</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Image Style</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white/70 outline-none">
                <option>Realistic</option>
                <option>Cyberpunk</option>
                <option>Digital Art</option>
                <option>3D Render</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale neon-glow-purple"
          >
            {isGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {isGenerating ? 'Synthesizing...' : 'Generate Art'}
          </button>
        </div>

        <div className="glass-card p-6 rounded-[32px]">
          <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Quick Enhancers</h4>
          <div className="flex flex-wrap gap-2">
            {['8K Resolution', 'Unreal Engine 5', 'Ray Tracing', 'Masterpiece', 'Cinematic Lighting'].map((tag, i) => (
              <button 
                key={i} 
                onClick={() => setPrompt(prev => prev + (prev ? ', ' : '') + tag)}
                className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-medium text-white/60 hover:text-white hover:border-white/20 transition-all"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="w-full h-full glass-main rounded-[32px] overflow-hidden flex items-center justify-center group">
          {result ? (
            <div className="w-full h-full relative">
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={result} 
                alt="Generated Art" 
                className="w-full h-full object-contain p-4"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-cyber-black/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="flex items-center gap-2 text-xs font-bold hover:text-neon-cyan transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
                <div className="w-px h-4 bg-white/10" />
                <button className="flex items-center gap-2 text-xs font-bold hover:text-neon-cyan transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center px-10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 animate-pulse">
                <Hexagon className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-display font-medium text-white/60 mb-2">Ready to Visualize</h3>
              <p className="text-sm text-white/20 max-w-xs uppercase tracking-widest leading-loose">
                {isGenerating ? 'Computational cores engaged. Rearranging sub-atomic pixels...' : 'Input instructions to begin holographic synthesis.'}
              </p>
              {isGenerating && (
                <div className="mt-8 w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-neon-purple to-transparent"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Synthetic Sparkles */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-neon-purple/20 border border-neon-purple/30 rounded-full">
          <Sparkles className="w-3 h-3 text-neon-purple" />
          <span className="text-[9px] font-bold text-neon-purple uppercase tracking-widest italic">Neural Synthesis v4</span>
        </div>
      </div>
    </div>
  );
};
