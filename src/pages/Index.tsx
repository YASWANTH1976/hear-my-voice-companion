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
import { QuickMoodCheck } from "@/components/QuickMoodCheck";
import { AgeGroupSurvey } from "@/components/AgeGroupSurvey";
import { SurveyInsights } from "@/components/SurveyInsights";
import { MoodJournal } from "@/components/MoodJournal";
import { CopingStrategies } from "@/components/CopingStrategies";
import { QuickExit } from "@/components/QuickExit";
import { AccessibilityEnhancements } from "@/components/AccessibilityEnhancements";
import { AIResponse } from "@/components/AIResponse";
import { ConversationInsights } from "@/components/ConversationInsights";
import { ResourceCenter } from "@/components/ResourceCenter";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";
import NotFound from "./NotFound";

const queryClient = new QueryClient();

const Index = () => {
  return (
    <VoiceProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-50/30">
        {/* Accessibility and Quick Exit */}
        <AccessibilityEnhancements />
        <QuickExit />
        
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
          {/* Voice Interface - Central Feature */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text leading-tight">
                HearMeOut
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your safe space for emotional expression and support. Speak your heart, and let AI provide compassionate guidance.
              </p>
            </div>
            
            {/* Voice Interface */}
            <VoiceInterface />
            
            {/* Current Emotion Display */}
            <EmotionDisplay />
          </div>

          {/* Quick Mood Check */}
          <QuickMoodCheck />
          
          {/* AI Response Section */}
          <AIResponse />
          
          {/* Conversation Insights */}
          <ConversationInsights />
          
          {/* Resource Center */}
          <ResourceCenter />
          
          {/* Wellness Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodJournal />
            <CopingStrategies />
          </div>

          {/* Survey and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgeGroupSurvey />
            <SurveyInsights />
          </div>
          
          {/* Admin Panel (for development/testing) */}
          <AdminPanel />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </VoiceProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
