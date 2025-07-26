import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, Play, Square } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const VoiceInterface: React.FC = () => {
  const {
    isRecording,
    isListening,
    transcript,
    audioLevel,
    startRecording,
    stopRecording,
    clearTranscript,
    speakResponse,
    error,
    clearError
  } = useVoice();

  const [waveformBars, setWaveformBars] = useState<number[]>(Array(12).fill(0));

  // Animate waveform based on audio level
  useEffect(() => {
    if (isRecording && audioLevel > 0) {
      const newBars = Array(12).fill(0).map(() => 
        Math.random() * audioLevel * 100 + (audioLevel * 20)
      );
      setWaveformBars(newBars);
    } else {
      setWaveformBars(Array(12).fill(0));
    }
  }, [audioLevel, isRecording]);

  const handlePlayback = () => {
    if (transcript) {
      speakResponse(transcript);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Error Display */}
      {error && (
        <Alert className="border-destructive/50 text-destructive">
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Recording Interface */}
      <Card className="card-hover">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Recording Button */}
            <div className="relative">
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={`
                  w-24 h-24 rounded-full text-white transition-all duration-300 transform
                  ${isRecording 
                    ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse-gentle' 
                    : 'gradient-primary hover:scale-105'
                  }
                  ${isListening ? 'emotion-glow' : ''}
                `}
              >
                {isRecording ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              
              {/* Recording State Indicator */}
              {isRecording && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce-gentle">
                  <div className="w-full h-full bg-red-400 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
            </div>

            {/* Waveform Visualization */}
            <div className="flex items-end justify-center space-x-1 h-16">
              {waveformBars.map((height, index) => (
                <div
                  key={index}
                  className={`
                    w-3 rounded-full transition-all duration-200 animate-wave
                    ${isRecording ? 'bg-primary' : 'bg-muted'}
                  `}
                  style={{
                    height: `${Math.max(4, height)}px`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Status Text */}
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                {isRecording 
                  ? 'Listening...' 
                  : 'Tap to start speaking'
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isRecording
                  ? 'I\'m here to listen and support you'
                  : 'Share what\'s on your mind, I\'m here to help'
                }
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayback}
                disabled={!transcript || isRecording}
                className="card-hover"
              >
                <Play className="h-4 w-4 mr-2" />
                Replay
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearTranscript}
                disabled={!transcript || isRecording}
                className="card-hover"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Transcript Display */}
      {transcript && (
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Volume2 className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">What you said:</h3>
                <p className="text-foreground/80 leading-relaxed">
                  {transcript}
                  {isListening && (
                    <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};