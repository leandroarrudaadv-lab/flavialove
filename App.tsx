
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Stars, Send, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- Types ---

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

// --- Components ---

const HeartGenerator: React.FC = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const heartIdCounter = useRef(0);

  const addHeart = useCallback(() => {
    const newHeart: FloatingHeart = {
      id: heartIdCounter.current++,
      x: Math.random() * 100,
      y: 110,
      size: Math.random() * (40 - 15) + 15,
      duration: Math.random() * (15 - 5) + 5,
      delay: Math.random() * 2,
      color: ['#ff4d4d', '#ff0066', '#ff85a2', '#ffccd5', '#ff4d6d'][Math.floor(Math.random() * 5)]
    };
    setHearts(prev => [...prev.slice(-40), newHeart]);
  }, []);

  useEffect(() => {
    const interval = setInterval(addHeart, 400);
    return () => clearInterval(interval);
  }, [addHeart]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            color: heart.color
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [aiMessage, setAiMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);

  const generateRomanticMessage = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Escreva uma mensagem de amor curta, profunda e poética para Flavia. A mensagem deve ser em português, carinhosa e cheia de admiração. Não use mais que 3 frases.",
      });
      setAiMessage(response.text || "Flavia, você é a luz que ilumina meus dias.");
      setShowSpecialMessage(true);
    } catch (error) {
      console.error("Erro ao gerar mensagem:", error);
      setAiMessage("Flavia, cada batida do meu coração é por você.");
      setShowSpecialMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4 overflow-hidden">
      {/* Dynamic Background */}
      <HeartGenerator />

      {/* Main Content Card */}
      <main className="relative z-10 w-full max-w-2xl bg-white/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 text-center transform transition-all duration-700 hover:scale-[1.01]">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500 rounded-full shadow-lg animate-pulse">
            <Heart size={48} className="text-white fill-current" />
          </div>
        </div>

        <h1 className="font-serif-elegant text-5xl md:text-7xl font-bold text-red-600 mb-4 tracking-tight drop-shadow-sm">
          Flavia,
        </h1>
        
        <p className="font-romantic text-4xl md:text-5xl text-rose-500 mb-8 animate-bounce">
          eu te amo
        </p>

        <div className="space-y-6">
          <p className="text-rose-700 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
            Este espaço foi criado para celebrar o amor que sinto por você. 
            Cada coração flutuante representa um momento feliz ao seu lado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <button
              onClick={generateRomanticMessage}
              disabled={isLoading}
              className="group relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-red-200/50 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Inspirando-se...</span>
                </div>
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>Mensagem para Você</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Generated Message Section */}
        {showSpecialMessage && (
          <div className="mt-12 p-6 bg-white/60 rounded-2xl border border-rose-200 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="italic text-rose-800 text-xl font-serif-elegant">
              "{aiMessage}"
            </p>
            <div className="mt-4 flex justify-center gap-1">
              <Stars className="text-amber-400 fill-current" size={16} />
              <Stars className="text-amber-400 fill-current" size={16} />
              <Stars className="text-amber-400 fill-current" size={16} />
            </div>
          </div>
        )}
      </main>

      {/* Footer / Floating Labels */}
      <footer className="absolute bottom-8 z-10 text-rose-400 text-sm font-semibold tracking-widest uppercase">
        Para sempre, Flavia
      </footer>

      {/* Decorative Ornaments */}
      <div className="fixed top-10 left-10 text-rose-200 opacity-50 hidden lg:block">
        <Heart size={120} className="fill-current" />
      </div>
      <div className="fixed bottom-10 right-10 text-rose-200 opacity-50 hidden lg:block rotate-12">
        <Heart size={160} className="fill-current" />
      </div>
    </div>
  );
}
