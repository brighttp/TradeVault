# 🏦 TradeVault - AI-Powered Trading Journal

TradeVault is an institutional-grade, full-stack cryptocurrency trading journal designed to track, analyze, and evaluate trading performance. Built with a focus on seamless user experience, it integrates real-time exchange data and leverages advanced Generative AI to act as a personalized trading psychology coach.

## ✨ Key Features

*   **Automated Trade Synchronization:** Seamlessly fetches real-time execution telemetry and trade history directly via the **OKX API**, eliminating manual data entry.
*   **AI Trading Coach (Gemini Integration):** Utilizes the **Google Gemini API** (Multimodal) to analyze post-trade data, PnL, emotional state, and uploaded chart screenshots. The AI provides objective, strict, and constructive feedback based on a customized institutional trading persona.
*   **Secure Authentication & Database:** Powered by **Supabase** with robust Row Level Security (RLS) to ensure user data and trading journals are entirely private and secure.
*   **Premium Institutional UI:** Features a dark-themed, highly responsive user interface with modern toast notifications (Sonner) for an immersive and professional experience.
*   **Edge-Optimized Architecture:** Deployed on **Vercel** utilizing Next.js Server Actions to keep API keys hidden and ensure fast, secure backend executions without CORS issues.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router & Server Actions)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **AI Engine:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 1.5 Flash/Pro)
*   **External API:** OKX REST API
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed and an active account on Supabase, Google AI Studio, and OKX.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/brighttp/TradeVault.git](https://github.com/brighttp/TradeVault.git)
   cd TradeVault
