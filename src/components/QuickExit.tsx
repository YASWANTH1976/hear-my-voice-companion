import React, { useEffect } from 'react';
import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const QuickExit: React.FC = () => {
  const { toast } = useToast();

  const handleQuickExit = () => {
    // Clear all local storage data
    localStorage.clear();
    
    // Clear speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Show brief message and redirect
    toast({
      title: "Privacy Protected",
      description: "All data cleared. Redirecting to a safe page...",
      duration: 2000,
    });
    
    // Redirect to a neutral website after a brief delay
    setTimeout(() => {
      window.location.href = 'https://www.google.com';
    }, 1500);
  };

  // Add keyboard shortcut for quick exit (Ctrl/Cmd + Shift + X)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'X') {
        event.preventDefault();
        handleQuickExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleQuickExit}
        variant="destructive"
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
        aria-label="Quick exit - clears all data and redirects to Google"
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Quick Exit</span>
        <Shield className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};