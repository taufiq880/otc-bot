import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, AnalysisSettings } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    signal: {
      type: Type.STRING,
      enum: ["BUY", "SELL", "NEUTRAL", "WAIT"],
      description: "The definitive trading signal. MUST have confluence of at least 2 indicators, ideally 3.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence percentage based on indicator alignment.",
    },
    trade_setup: {
      type: Type.OBJECT,
      properties: {
        entry: { type: Type.STRING, description: "Exact entry level (e.g. 'Current Market Price' or specific level)." },
        stop_loss: { type: Type.STRING, description: "Tight Stop Loss level." },
        take_profit: { type: Type.STRING, description: "Realistic Take Profit level." },
      },
      required: ["entry", "stop_loss", "take_profit"],
    },
    market_structure: {
      type: Type.STRING,
      description: "Trend context (Uptrend, Downtrend, Ranging).",
    },
    patterns_detected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Candle patterns or chart patterns detected.",
    },
    indicators: {
      type: Type.OBJECT,
      properties: {
        rsi: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Value & Action (e.g. '75 - Hooking Down')" },
            sentiment: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] }
          }
        },
        ema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Trend relation (e.g. 'Price < EMA 50')" },
            sentiment: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] }
          }
        },
        bollinger: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Band interaction (e.g. 'Upper Band Rejection')" },
            sentiment: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] }
          }
        }
      },
      required: ["rsi", "ema", "bollinger"]
    },
    predicted_candle_close: {
      type: Type.STRING,
      enum: ["GREEN", "RED", "DOJI"],
      description: "Prediction for the active candle color.",
    },
    key_levels: {
      type: Type.OBJECT,
      properties: {
        support: { type: Type.STRING },
        resistance: { type: Type.STRING },
      },
    },
    reasoning: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Explain why the indicators align or contradict.",
    },
  },
  required: ["signal", "confidence", "trade_setup", "market_structure", "patterns_detected", "indicators", "predicted_candle_close", "key_levels", "reasoning"],
};

export const analyzeChartImage = async (base64Image: string, settings: AnalysisSettings): Promise<AnalysisResult> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64,
            },
          },
          {
            text: `You are an advanced OTC market signal bot.
            Your job is to analyze price action and provide highly accurate BUY/SELL signals.

            Integrate the following three indicators into your analysis, respecting these USER SETTINGS:

            1. **RSI (Relative Strength Index)** - Period: ${settings.rsi.period}
               - Detect overbought (Above ${settings.rsi.overbought}) / oversold (Below ${settings.rsi.oversold}) conditions.
               - Confirm reversals when RSI crosses these key thresholds.

            2. **Moving Averages (EMA ${settings.ema.period1} & EMA ${settings.ema.period2})**
               - Identify short-term vs long-term trend direction.
               - Generate signals when EMA crossover aligns with price action.
               - Bullish: Price > EMA ${settings.ema.period1}. Bearish: Price < EMA ${settings.ema.period1}.

            3. **Bollinger Bands** - Period: ${settings.bollinger.period}, StdDev: ${settings.bollinger.stdDev}
               - Spot volatility expansions and contractions.
               - Detect breakout or rejection at upper/lower bands.

            **Signal Rules:**
            - Combine candlestick psychology + market structure (support/resistance, FVG, order blocks) with these indicators.
            - **Only issue signals when at least 2 out of 3 indicators confirm the same direction.**
            - Provide clear ENTRY, STOP LOSS, and TARGET levels.
            - Explain reasoning in simple terms (e.g., "RSI oversold + EMA bearish crossover + price rejecting Bollinger mid-band").
            - Accuracy goal: 90% or higher.

            OUTPUT:
            - JSON format only.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Zero creativity, pure logic
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(response.text) as AnalysisResult;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};