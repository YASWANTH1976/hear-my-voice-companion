import React, { useState } from 'react';
import { Volume2, Copy, MessageCircle, Clock, VolumeX } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const AIResponse: React.FC = () => {
  const { aiResponse, speakResponse } = useVoice();
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!aiResponse) {
    return null;
  }

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(aiResponse.text);
      toast({
        title: "Copied to clipboard",
        description: "AI response has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleSpeakResponse = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(aiResponse.text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="card-hover border-primary/20 bg-gradient-to-br from-primary/5 to-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="gradient-primary p-2 rounded-lg">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg">AI Response</span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTime(aiResponse.timestamp)}</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* AI Response Text */}
          <div className="p-4 bg-white/80 rounded-lg border border-primary/10">
            <p className="text-foreground leading-relaxed text-base">
              {aiResponse.text}
            </p>
          </div>

          {/* Emotion Context */}
          <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
            <div 
              className="w-3 h-3 rounded-full animate-pulse-gentle"
              style={{ backgroundColor: `hsl(var(--emotion-${aiResponse.emotion.type}))` }}
            />
            <span className="text-sm text-muted-foreground">
              Response generated based on detected {aiResponse.emotion.type}
              {aiResponse.emotion.topics.length > 0 && (
                <> related to {aiResponse.emotion.topics.join(', ')}</>
              )}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSpeakResponse}
                className="card-hover"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyResponse}
                className="card-hover"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            {/* Response Quality Indicators */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Contextual</span>
              </div>
              {aiResponse.emotion.confidence > 0.7 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">High Confidence</span>
                </div>
              )}
            </div>
          </div>

          {/* Supportive Message */}
          <div className="p-3 bg-gradient-to-r from-primary/10 to-purple-100/50 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              💙 Remember: This is a supportive conversation, not medical advice. 
              For professional help, please consult a qualified mental health professional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};