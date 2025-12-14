import React from 'react';
import { Settings } from 'lucide-react';
import { AnalysisSettings } from '../types';

interface SettingsPanelProps {
  settings: AnalysisSettings;
  onChange: (settings: AnalysisSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const updateRsi = (key: keyof AnalysisSettings['rsi'], value: number) => {
    onChange({ ...settings, rsi: { ...settings.rsi, [key]: value } });
  };

  const updateBollinger = (key: keyof AnalysisSettings['bollinger'], value: number) => {
    onChange({ ...settings, bollinger: { ...settings.bollinger, [key]: value } });
  };

  const updateEma = (key: keyof AnalysisSettings['ema'], value: number) => {
    onChange({ ...settings, ema: { ...settings.ema, [key]: value } });
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-slate-200">Indicator Strategy Settings</h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-900">AUTO-SAVED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RSI Settings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
             RSI Configuration
          </h4>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
                <span>Period Length</span>
                <span className="text-white font-mono">{settings.rsi.period}</span>
            </div>
            <input 
                type="range" min="2" max="30" 
                value={settings.rsi.period} 
                onChange={(e) => updateRsi('period', parseInt(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex space-x-4">
             <div className="w-1/2 space-y-1">
                <label className="text-xs text-slate-400 block">Overbought {'>'}</label>
                <input 
                    type="number" 
                    value={settings.rsi.overbought}
                    onChange={(e) => updateRsi('overbought', parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
             </div>
             <div className="w-1/2 space-y-1">
                <label className="text-xs text-slate-400 block">Oversold {'<'}</label>
                <input 
                    type="number" 
                    value={settings.rsi.oversold}
                    onChange={(e) => updateRsi('oversold', parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
             </div>
          </div>
        </div>

        {/* Bollinger Settings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
             Bollinger Bands
          </h4>
          
           <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
                <span>Period (SMA)</span>
                <span className="text-white font-mono">{settings.bollinger.period}</span>
            </div>
            <input 
                type="range" min="5" max="50" 
                value={settings.bollinger.period} 
                onChange={(e) => updateBollinger('period', parseInt(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

           <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
                <span>Std Deviation</span>
                <span className="text-white font-mono">{settings.bollinger.stdDev}</span>
            </div>
            <input 
                type="range" min="1" max="4" step="0.1"
                value={settings.bollinger.stdDev} 
                onChange={(e) => updateBollinger('stdDev', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* EMA Settings */}
        <div className="space-y-3 md:col-span-2 border-t border-slate-800 pt-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
             EMA (Moving Average) Configuration
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Short Period (Fast)</span>
                    <span className="text-white font-mono">{settings.ema.period1}</span>
                </div>
                <input 
                    type="range" min="5" max="100" 
                    value={settings.ema.period1} 
                    onChange={(e) => updateEma('period1', parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
             </div>
             <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Long Period (Slow)</span>
                    <span className="text-white font-mono">{settings.ema.period2}</span>
                </div>
                <input 
                    type="range" min="10" max="200" 
                    value={settings.ema.period2} 
                    onChange={(e) => updateEma('period2', parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
             </div>
          </div>
        </div>

      </div>
      
      <div className="pt-2">
         <p className="text-[10px] text-slate-500 italic">
            * Adjusting these values enforces stricter rules for the AI, filtering out noise and weak signals. Settings are saved automatically.
         </p>
      </div>
    </div>
  );
};

export default SettingsPanel;