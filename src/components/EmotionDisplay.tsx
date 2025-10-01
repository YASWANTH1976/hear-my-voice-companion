import React from 'react';
import { 
  AlertTriangle, 
  Cloud, 
  Flame, 
  Zap, 
  Sun, 
  HelpCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const emotionIcons = {
  anxiety: AlertTriangle,
  sadness: Cloud,
  anger: Flame,
  stress: Zap,
  happiness: Sun,
  confusion: HelpCircle
};

const emotionColors = {
  anxiety: 'emotion-anxiety',
  sadness: 'emotion-sadness', 
  anger: 'emotion-anger',
  stress: 'emotion-stress',
  happiness: 'emotion-happiness',
  confusion: 'emotion-confusion'
};

const emotionLabels = {
  anxiety: 'Anxiety',
  sadness: 'Sadness',
  anger: 'Anger', 
  stress: 'Stress',
  happiness: 'Happiness',
  confusion: 'Confusion'
};

const intensityLabels = {
  low: 'Mild',
  medium: 'Moderate', 
  high: 'Strong'
};

export const EmotionDisplay: React.FC = () => {
  const { currentEmotion } = useVoice();

  if (!currentEmotion) {
    return null;
  }

  // Convert numeric intensity (0-1) to categorical intensity level
  const getIntensityLevel = (intensity: number): 'low' | 'medium' | 'high' => {
    if (intensity < 0.33) return 'low';
    if (intensity < 0.67) return 'medium';
    return 'high';
  };

  const intensityLevel = getIntensityLevel(currentEmotion.intensity);
  const EmotionIcon = emotionIcons[currentEmotion.type];
  const emotionColor = emotionColors[currentEmotion.type];
  const confidencePercentage = Math.round(currentEmotion.confidence * 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Emotion Analysis</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Primary Emotion Display */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <div 
              className={`p-3 rounded-full animate-pulse-gentle`}
              style={{ backgroundColor: `hsl(var(--emotion-${currentEmotion.type}))` }}
            >
              <EmotionIcon className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {emotionLabels[currentEmotion.type]}
                </h3>
                <Badge 
                  variant="secondary"
                  className={`
                    ${intensityLevel === 'high' ? 'bg-red-100 text-red-800' : ''}
                    ${intensityLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${intensityLevel === 'low' ? 'bg-green-100 text-green-800' : ''}
                  `}
                >
                  {intensityLabels[intensityLevel]}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{confidencePercentage}%</span>
                </div>
                <Progress 
                  value={confidencePercentage} 
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Topics Detected */}
          {currentEmotion.topics.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-foreground">Topics Mentioned</h4>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentEmotion.topics.map((topic, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="capitalize"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Intensity Visualization */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Intensity Level</span>
            </h4>
            
            <div className="flex items-center space-x-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <div
                  key={level}
                  className={`
                    flex-1 h-3 rounded-full transition-all duration-300
                    ${intensityLevel === level 
                      ? `bg-${emotionColor}` 
                      : 'bg-muted'
                    }
                    ${intensityLevel === level && level === 'high' 
                      ? 'animate-pulse-gentle' 
                      : ''
                    }
                  `}
                  style={{
                    backgroundColor: intensityLevel === level 
                      ? `hsl(var(--emotion-${currentEmotion.type}))` 
                      : undefined
                  }}
                />
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-foreground/80 leading-relaxed">
              I can sense <strong>{emotionLabels[currentEmotion.type].toLowerCase()}</strong> 
              {intensityLevel === 'high' && ' quite strongly'} 
              {intensityLevel === 'medium' && ' moderately'} 
              {intensityLevel === 'low' && ' mildly'} 
              in what you've shared.
              {currentEmotion.topics.length > 0 && (
                <> It seems to be related to {currentEmotion.topics.join(', ')}</>
              )}. Your feelings are completely valid and I'm here to support you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};