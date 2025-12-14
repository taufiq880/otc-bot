import React, { useState, useEffect } from 'react';
import { BarChart2, Zap } from 'lucide-react';
import Uploader from './components/Uploader';
import AnalysisCard from './components/AnalysisCard';
import SettingsPanel from './components/SettingsPanel';
import { analyzeChartImage } from './services/geminiService';
import { AnalysisResult, AnalysisSettings } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load settings from local storage or use defaults
  const [settings, setSettings] = useState<AnalysisSettings>(() => {
    const savedSettings = localStorage.getItem('otc_analyst_settings');
    if (savedSettings) {
      try {
        // Merge with defaults to ensure new keys (like ema) exist if loading old data
        const parsed = JSON.parse(savedSettings);
        return {
          rsi: { period: 14, overbought: 70, oversold: 30, ...parsed.rsi },
          bollinger: { period: 20, stdDev: 2.0, ...parsed.bollinger },
          ema: { period1: 20, period2: 50, ...parsed.ema }
        };
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      rsi: { period: 14, overbought: 70, oversold: 30 },
      bollinger: { period: 20, stdDev: 2.0 },
      ema: { period1: 20, period2: 50 }
    };
  });

  // Auto-save settings whenever they change
  useEffect(() => {
    localStorage.setItem('otc_analyst_settings', JSON.stringify(settings));
  }, [settings]);

  const handleImageSelected = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Pass settings to the service
      const result = await analyzeChartImage(base64Image, settings);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze chart. Please try again with a clearer screenshot.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-blue-500/30">
      
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart2 className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white">OTC<span className="text-blue-500">Analyst</span></h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">AI Powered Signal Bot</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Zap className="w-3 h-3" />
            <span>GEMINI 2.5 FLASH ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload & Settings */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Chart Analysis</h2>
                <p className="text-slate-400">Upload a screenshot of your OTC market chart. Our AI will analyze price action based on your custom indicator parameters.</p>
            </div>
            
            <SettingsPanel settings={settings} onChange={setSettings} />

            <Uploader 
                onImageSelected={handleImageSelected} 
                onClear={handleClear} 
                isLoading={loading} 
            />

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Instructions / Features */}
            {!analysis && !loading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                            <span className="text-purple-400 font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-slate-200">Set Strategy</h3>
                        <p className="text-xs text-slate-500 mt-1">Configure RSI, EMA & Bollinger thresholds.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                            <span className="text-blue-400 font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-slate-200">Upload Chart</h3>
                        <p className="text-xs text-slate-500 mt-1">Take a clear screenshot of your broker's chart.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                            <span className="text-emerald-400 font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-slate-200">Get Signal</h3>
                        <p className="text-xs text-slate-500 mt-1">Receive a Buy/Sell signal with detailed reasoning.</p>
                    </div>
                </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
                <AnalysisCard result={analysis} loading={loading} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;