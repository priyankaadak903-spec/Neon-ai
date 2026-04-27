import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2, Paperclip, Mic, StopCircle, Globe, ChevronDown, Cpu, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { chatStream } from '../services/geminiService';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  user: FirebaseUser;
}

const MODELS = [
  { id: 'gemini-3.1-pro-preview', name: 'Gemini Pro 3.1', provider: 'Google', icon: Bot, color: 'text-neon-blue' },
  { id: 'gemini-3-flash-preview', name: 'Gemini Flash 3', provider: 'Google', icon: Sparkles, color: 'text-neon-cyan' },
  { id: 'gpt-4o', name: 'GPT-4o (via Neon)', provider: 'OpenAI (Proxy)', icon: Cpu, color: 'text-neon-purple' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 (via Neon)', provider: 'Anthropic (Proxy)', icon: User, color: 'text-neon-pink' },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'wel', role: 'model', text: "Systems online. Neural uplink established. I am **NEON**, your synthetic intelligence core. How shall we proceed today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsgText = input;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await chatStream(userMsgText, history, { 
        model: selectedModel.id, 
        search: useSearch 
      });
      
      let fullText = '';
      const assistantMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, text: fullText } : m
        ));
      }

      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        model: selectedModel.id,
        messages: [...messages, userMsg, { role: 'model', text: fullText, timestamp: new Date() }],
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Neural processing failure. Check your uplink configuration.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-[32px] overflow-hidden lg:max-w-5xl mx-auto shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-cyber-dark border border-white/10 flex items-center justify-center neon-glow-blue overflow-hidden group">
              <Bot className={cn("w-8 h-8 transition-all duration-500", isTyping ? "text-neon-cyan animate-pulse" : "text-white/40")} />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-cyan border-2 border-cyber-black rounded-full" />
          </div>
          <div>
            <div className="relative">
              <button 
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-2 group"
              >
                <h3 className="font-bold text-xl tracking-tight group-hover:text-neon-blue transition-colors">
                  {selectedModel.name}
                </h3>
                <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", isModelMenuOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isModelMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 glass-main rounded-2xl p-2 z-50 border border-white/10 shadow-2xl"
                  >
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m);
                          setIsModelMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                          selectedModel.id === m.id ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <m.icon className={cn("w-5 h-5", m.color)} />
                        <div className="text-left">
                          <p className="text-sm font-bold">{m.name}</p>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">{m.provider}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">Live Uplink</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <button 
                onClick={() => setUseSearch(!useSearch)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full border transition-all",
                  useSearch 
                    ? "bg-neon-blue/20 border-neon-blue/50 text-neon-blue font-bold shadow-[0_0_10px_rgba(110,127,243,0.3)]" 
                    : "border-white/10 text-white/30 hover:text-white"
                )}
              >
                <Globe className="w-3 h-3" />
                <span className="text-[9px] uppercase tracking-widest leading-none mt-0.5">{useSearch ? 'Search Enabled' : 'Search Off'}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setMessages([messages[0]])} className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white/30 transition-colors group">
            <Trash2 className="w-5 h-5 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar lg:p-10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                msg.role === 'user' ? "bg-neon-purple" : "bg-white/10"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-neon-blue" />}
              </div>
              <div className={cn(
                "px-5 py-3 rounded-2xl relative shadow-xl overflow-hidden group/msg",
                msg.role === 'user' ? "bg-gradient-to-br from-neon-purple/30 to-neon-purple/10 text-white border border-neon-purple/30" : "bg-white/5 text-white/90 border border-white/5"
              )}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className="flex items-center justify-between mt-2">
                   <span className="text-[9px] text-white/20 uppercase tracking-widest font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex gap-2">
                     <Sparkles className="w-3 h-3 text-neon-cyan/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-neon-blue animate-pulse" />
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="relative glass-card bg-cyber-dark/50 p-2 rounded-2xl border border-white/10 flex items-center gap-2 group focus-within:border-neon-blue/50 transition-all">
          <button className="p-3 text-white/30 hover:text-white transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask ${selectedModel.name}...`}
            className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm resize-none max-h-32 hide-scrollbar"
            rows={1}
          />
          <div className="flex items-center gap-2 pr-2">
            {isTyping && (
              <div className="flex items-center gap-1 overflow-hidden h-8 w-12 px-2">
                 {[...Array(5)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: [4, 20, 6, 12, 4] }}
                     transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                     className="w-1 bg-neon-cyan rounded-full"
                   />
                 ))}
              </div>
            )}
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "p-3 rounded-xl transition-all",
                isRecording ? "bg-red-500/20 text-red-500 animate-pulse" : "text-white/30 hover:text-neon-cyan"
              )}
            >
              {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-neon-blue text-white rounded-xl hover:neon-glow-blue disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-white/20 mt-4 uppercase tracking-widest flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3" /> Press Enter to transmit data to Neon Neural Network
        </p>
      </div>
    </div>
  );
};
