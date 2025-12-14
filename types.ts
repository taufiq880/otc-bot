export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  NEUTRAL = 'NEUTRAL',
  WAIT = 'WAIT'
}

export interface AnalysisSettings {
  rsi: {
    period: number;
    overbought: number;
    oversold: number;
  };
  bollinger: {
    period: number;
    stdDev: number;
  };
  ema: {
    period1: number; // Short term (e.g. 20)
    period2: number; // Long term (e.g. 50)
  };
}

export interface IndicatorAnalysis {
  status: string; // e.g. "Overbought at 75", "Price below EMA 50"
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface AnalysisResult {
  signal: SignalType;
  confidence: number;
  // Professional Trade Setup
  trade_setup: {
    entry: string;
    stop_loss: string;
    take_profit: string;
  };
  // Advanced Analysis
  market_structure: string; // e.g. "Bullish Order Flow", "Accumulation"
  patterns_detected: string[]; // e.g. ["Liquidity Sweep", "Fair Value Gap"]
  
  // Technical Indicators
  indicators: {
    rsi: IndicatorAnalysis;
    ema: IndicatorAnalysis;
    bollinger: IndicatorAnalysis;
  };

  predicted_candle_close: 'GREEN' | 'RED' | 'DOJI'; 
  key_levels: {
    support: string;
    resistance: string;
  };
  reasoning: string[];
}

export interface ChartData {
  imageUri: string; // Base64
  file: File;
}