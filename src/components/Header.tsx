import React from 'react';
import { ChevronDown, Heart, Brain } from 'lucide-react';
import { useVoice, SUPPORTED_LANGUAGES } from '@/context/VoiceContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { selectedLanguage, setSelectedLanguage } = useVoice();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="gradient-primary p-2 rounded-xl">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              HearMeOut
            </h1>
            <p className="text-sm text-muted-foreground">AI Mental Health Companion</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Language:</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="card-hover min-w-[140px] justify-between"
              >
                <span className="flex items-center space-x-2">
                  <span>{SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.flag}</span>
                  <span className="hidden sm:inline">
                    {SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.nativeName}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="min-w-[200px]">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`flex items-center space-x-3 cursor-pointer ${
                    selectedLanguage === code ? 'bg-primary/10' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};