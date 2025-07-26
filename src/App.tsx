import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VoiceProvider } from "@/context/VoiceContext";
import { Header } from "@/components/Header";
import { VoiceInterface } from "@/components/VoiceInterface";
import { EmotionDisplay } from "@/components/EmotionDisplay";
import { AIResponse } from "@/components/AIResponse";
import { CopingStrategies } from "@/components/CopingStrategies";
import { Footer } from "@/components/Footer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const MainApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-50/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
            Welcome to HearMeOut
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your compassionate AI mental health companion. Share what's on your mind, 
            and receive personalized support with interactive wellness strategies.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span>🔒</span>
              <span>100% Private</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🌍</span>
              <span>Multilingual</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🤖</span>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Voice Interface */}
        <VoiceInterface />

        {/* Emotion Analysis */}
        <EmotionDisplay />

        {/* AI Response */}
        <AIResponse />

        {/* Coping Strategies */}
        <CopingStrategies />
      </main>

      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VoiceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
