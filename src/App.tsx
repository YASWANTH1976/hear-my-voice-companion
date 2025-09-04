import React from 'react';
import { Button } from "@/components/ui/button";
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
import { MoodJournal } from "@/components/MoodJournal";
import { QuickMoodCheck } from "@/components/QuickMoodCheck";
import { Footer } from "@/components/Footer";
import { QuickExit } from "@/components/QuickExit";
import { AccessibilityEnhancements } from "@/components/AccessibilityEnhancements";
import { AgeGroupSurvey } from "@/components/AgeGroupSurvey";
import { SurveyInsights } from "@/components/SurveyInsights";
import { AdminPanel } from "@/components/AdminPanel";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const MainApp = () => {
  const [showSurvey, setShowSurvey] = useState(() => {
    // Show survey if user hasn't completed it and has used the app a few times
    const hasCompleted = localStorage.getItem('surveyCompleted') === 'true';
    const usageCount = parseInt(localStorage.getItem('appUsageCount') || '0');
    return !hasCompleted && usageCount >= 3;
  });

  const [showInsights, setShowInsights] = useState(false);

  // Track app usage for survey timing
  useEffect(() => {
    const currentCount = parseInt(localStorage.getItem('appUsageCount') || '0');
    localStorage.setItem('appUsageCount', (currentCount + 1).toString());
  }, []);

  // Check for admin access
  const isResearcher = localStorage.getItem('researcherMode') === 'true';
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-50/30">
      {/* Quick Exit Button */}
      <QuickExit />
      
      {/* Accessibility Enhancements */}
      <AccessibilityEnhancements />
      
      <Header />
      
      <main 
        className="container mx-auto px-4 py-8 space-y-8"
        tabIndex={-1}
        role="main"
        aria-label="Main content"
      >
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

        {/* Wellness Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <QuickMoodCheck />
          <MoodJournal />
        </div>

        {/* Survey Section */}
        {showSurvey && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Help Us Improve HearMeOut</h2>
              <p className="text-muted-foreground">
                Share your experience to help us create better mental health support for your age group
              </p>
            </div>
            <AgeGroupSurvey />
            <div className="text-center">
              <Button 
                onClick={() => setShowSurvey(false)} 
                variant="ghost" 
                size="sm"
              >
                Maybe later
              </Button>
            </div>
          </div>
        )}

        {/* Survey Insights for Admins/Researchers */}
        {isResearcher && (
          <div className="space-y-4">
            <AdminPanel />
          </div>
        )}
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
          <Route path="/admin" element={
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-50/30 p-8">
              <AdminPanel />
            </div>
          } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
