import React from 'react';
import { AnalysisResult, SignalType, IndicatorAnalysis } from '../types';
import { TrendingUp, TrendingDown, Minus, Activity, Gauge, Zap, Waves } from 'lucide-react';

interface AnalysisCardProps {
  result: AnalysisResult | null;
  loading: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-xl animate-pulse flex flex-col items-center justify-center min-h-[600px]">
        <div className="flex space-x-2 mb-8">
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce delay-75"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
        </div>
        <div className="h-8 w-64 bg-slate-800 rounded mb-4"></div>
        <div className="h-4 w-48 bg-slate-800 rounded mb-8"></div>
        
        <div className="w-full grid grid-cols-3 gap-4 mb-8">
            <div className="h-20 bg-slate-800 rounded border border-slate-700"></div>
            <div className="h-20 bg-slate-800 rounded border border-slate-700"></div>
            <div className="h-20 bg-slate-800 rounded border border-slate-700"></div>
        </div>
        <p className="text-blue-400 font-mono text-sm animate-pulse text-center">
            CALCULATING RSI DIVERGENCE...<br/>
            CHECKING EMA CROSSOVERS...<br/>
            ANALYZING BOLLINGER VOLATILITY...
        </p>
      </div>
    );
  }

  if (!result) return null;

  const isBuy = result.signal === SignalType.BUY;
  const isSell = result.signal === SignalType.SELL;
  
  const themeColor = isBuy ? 'emerald' : isSell ? 'rose' : 'slate';
  const ThemeIcon = isBuy ? TrendingUp : isSell ? TrendingDown : Minus;

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'BULLISH') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (sentiment === 'BEARISH') return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
  };

  const IndicatorBadge = ({ label, data, icon: Icon }: { label: string, data: IndicatorAnalysis, icon: any }) => (
    <div className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${getSentimentColor(data.sentiment)}`}>
        <div className="flex items-center space-x-2 mb-2">
            <Icon className="w-4 h-4 opacity-80" />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-sm font-semibold leading-tight">{data.status}</span>
        <span className="text-[10px] font-bold mt-1 opacity-70">{data.sentiment}</span>
    </div>
  );

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
      
      {/* 1. SIGNAL HEADER */}
      <div className={`relative p-6 flex flex-col items-center justify-center border-b border-slate-800 ${isBuy ? 'bg-emerald-500/10' : isSell ? 'bg-rose-500/10' : 'bg-slate-800'}`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${isBuy ? 'bg-emerald-500' : isSell ? 'bg-rose-500' : 'bg-slate-500'}`}></div>
        
        <div className="flex items-center space-x-3 mb-2">
            <ThemeIcon className={`w-8 h-8 text-${themeColor}-400`} />
            <h2 className={`text-4xl font-black tracking-tighter text-${themeColor}-400`}>{result.signal}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-${themeColor}-500/20 text-${themeColor}-300 border border-${themeColor}-500/30`}>
                CONFIDENCE: {result.confidence}%
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 border border-slate-600`}>
                TARGET: {result.predicted_candle_close}
            </span>
        </div>
      </div>

      {/* 2. TECHNICAL INDICATORS DASHBOARD */}
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
            <Activity className="w-3 h-3 mr-1" /> Technical Confluence
        </h3>
        <div className="grid grid-cols-3 gap-2">
            <IndicatorBadge label="RSI (14)" data={result.indicators.rsi} icon={Gauge} />
            <IndicatorBadge label="EMA 20/50" data={result.indicators.ema} icon={Zap} />
            <IndicatorBadge label="Bollinger" data={result.indicators.bollinger} icon={Waves} />
        </div>
      </div>

      {/* 3. TRADE SETUP TICKET */}
      <div className="p-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Entry</span>
                    <span className="text-sm font-mono font-bold text-white">{result.trade_setup.entry}</span>
                </div>
                
                <div className="flex flex-col items-center border-l border-slate-700/50 border-r">
                    <span className="text-[10px] text-rose-400/80 uppercase font-bold mb-1">Stop Loss</span>
                    <span className="text-sm font-mono font-bold text-rose-200">{result.trade_setup.stop_loss}</span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-emerald-400/80 uppercase font-bold mb-1">Take Profit</span>
                    <span className="text-sm font-mono font-bold text-emerald-200">{result.trade_setup.take_profit}</span>
                </div>
            </div>
        </div>
      </div>

      {/* 4. ADVANCED ANALYSIS & LOGIC */}
      <div className="px-6 pb-6 space-y-4">
        
        {/* Reasoning List */}
        <div>
             <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Strategy Reasoning</h3>
             <ul className="space-y-2">
                {result.reasoning.map((reason, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-300 bg-slate-800/30 p-2 rounded">
                        <span className={`mr-2 mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isBuy ? 'bg-emerald-500' : isSell ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
                        {reason}
                    </li>
                ))}
             </ul>
        </div>

        {/* Tags & Levels */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
             <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                {result.patterns_detected.map((pattern, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-bold uppercase border border-slate-700">
                        {pattern}
                    </span>
                ))}
            </div>
            <div className="text-right">
                <p className="text-[10px] text-slate-600">Structure: {result.market_structure}</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisCard;