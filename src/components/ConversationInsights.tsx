import React from 'react';
import { Brain, TrendingUp, Target, Lightbulb, Heart, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoice } from '@/context/VoiceContext';

export const ConversationInsights: React.FC = () => {
  const { responseHistory, currentEmotion, conversationContext } = useVoice();

  if (responseHistory.length === 0) {
    return null;
  }

  // Analyze patterns in conversation
  const emotionFrequency = responseHistory.reduce((acc, response) => {
    acc[response.emotion.type] = (acc[response.emotion.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantEmotion = Object.entries(emotionFrequency)
    .sort(([,a], [,b]) => b - a)[0];

  const topicsDiscussed = [...new Set(
    responseHistory.flatMap(r => r.emotion.topics)
  )].slice(0, 3);

  const generateInsights = () => {
    const insights = [];

    if (dominantEmotion && dominantEmotion[1] >= 3) {
      insights.push({
        type: 'pattern',
        title: 'Emotional Pattern',
        content: `You've expressed ${dominantEmotion[0]} frequently in our conversation. This might indicate an area that needs attention.`,
        icon: TrendingUp
      });
    }

    if (topicsDiscussed.length > 0) {
      insights.push({
        type: 'topics',
        title: 'Key Life Areas',
        content: `We've discussed ${topicsDiscussed.join(', ')}. These seem to be important areas in your life right now.`,
        icon: Target
      });
    }

    if (responseHistory.length >= 5) {
      insights.push({
        type: 'progress',
        title: 'Conversation Depth',
        content: `You've shared ${responseHistory.length} responses with me. Opening up like this shows real strength and self-awareness.`,
        icon: Heart
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getRecommendations = () => {
    const recommendations = [];

    if (dominantEmotion?.[0] === 'anxiety') {
      recommendations.push('Try the 4-7-8 breathing technique when anxiety peaks');
      recommendations.push('Consider grounding exercises like naming 5 things you can see');
    }

    if (dominantEmotion?.[0] === 'sadness') {
      recommendations.push('Gentle movement like walking can help with sadness');
      recommendations.push('Journaling your thoughts might provide clarity');
    }

    if (dominantEmotion?.[0] === 'stress') {
      recommendations.push('Progressive muscle relaxation can help release tension');
      recommendations.push('Break large tasks into smaller, manageable steps');
    }

    if (topicsDiscussed.includes('work')) {
      recommendations.push('Consider setting boundaries between work and personal time');
    }

    if (topicsDiscussed.includes('relationship')) {
      recommendations.push('Communication exercises might strengthen your relationships');
    }

    return recommendations.slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="card-hover border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="gradient-primary p-2 rounded-lg">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span>Conversation Insights</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Emotional State */}
          {currentEmotion && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Emotional State</span>
                <Badge variant="outline" className="capitalize">
                  {currentEmotion.type}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(var(--emotion-${currentEmotion.type}))` }}
                />
                <span className="text-sm text-muted-foreground">
                  Intensity: {currentEmotion.intensity} • Confidence: {Math.round(currentEmotion.confidence * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Insights</span>
              </h4>
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-start space-x-3">
                    <insight.icon className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium">{insight.title}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Personalized Suggestions</span>
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-2 bg-green-50/50 rounded-lg border border-green-200/50">
                    <p className="text-sm text-green-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <div className="text-center">
              <div className="text-lg font-semibold">{responseHistory.length}</div>
              <div className="text-xs text-muted-foreground">Responses Shared</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{topicsDiscussed.length}</div>
              <div className="text-xs text-muted-foreground">Life Areas Discussed</div>
            </div>
          </div>

          {/* Session Duration */}
          {responseHistory.length > 0 && (
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Session started {Math.round((Date.now() - responseHistory[responseHistory.length - 1].timestamp.getTime()) / (1000 * 60))} minutes ago
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};