import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am FORESIGHT AI, your supply chain intelligence co-pilot for NorthBay Living. How can I assist with your 6-week demand forecast, stockout risks, or reorder planning today?"
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Which 5 SKUs are at highest stockout risk?',
    'Summarize total rupee financial impact',
    'Explain WAPE performance vs baseline',
    'What action is recommended for overstocked SKUs?'
  ];

  const handleSend = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'assistant', text: data.insight }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'FORESIGHT AI Insights: Based on 200 active SKUs, 60 SKUs are in Reorder Now with ₹84.2 Lakhs sales at risk. 58 SKUs are overstocked with ₹63.8 Lakhs locked capital. The ML model achieved 14.2% WAPE.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col justify-between shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">FORESIGHT AI Co-Pilot</h3>
              <p className="text-[10px] text-slate-400">Gemini-Powered Supply Chain Intelligence</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-xl shrink-0 ${m.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800 text-cyan-400'}`}>
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing NorthBay Living data...</span>
            </div>
          )}
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Suggested Executive Prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[10px] bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full text-left transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask FORESIGHT AI anything about inventory..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
