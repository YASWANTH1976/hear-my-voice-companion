import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Brain, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MoodEntry {
  date: string;
  mood: string;
  intensity: number;
  triggers?: string[];
  notes?: string;
}

export const MoodAnalytics: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    // Load mood data from localStorage
    const savedMoods = localStorage.getItem('mood-analytics');
    if (savedMoods) {
      setMoodData(JSON.parse(savedMoods));
    }
  }, []);

  const getEmotionColor = (mood: string) => {
    const colors: Record<string, string> = {
      'happy': 'hsl(var(--chart-2))',
      'sad': 'hsl(var(--chart-4))',
      'angry': 'hsl(var(--destructive))',
      'anxious': 'hsl(var(--chart-3))',
      'calm': 'hsl(var(--chart-1))',
      'excited': 'hsl(var(--chart-5))',
      'neutral': 'hsl(var(--muted-foreground))'
    };
    return colors[mood.toLowerCase()] || 'hsl(var(--muted-foreground))';
  };

  const getRecentTrends = () => {
    const recent = moodData.slice(-7);
    const avgIntensity = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    const commonMoods = recent.reduce((acc: Record<string, number>, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    
    const topMood = Object.keys(commonMoods).reduce((a, b) => 
      commonMoods[a] > commonMoods[b] ? a : b, Object.keys(commonMoods)[0]
    );

    return { avgIntensity: avgIntensity || 0, topMood: topMood || 'neutral' };
  };

  const { avgIntensity, topMood } = getRecentTrends();

  const getInsights = () => {
    if (moodData.length < 3) return ["Start tracking your mood regularly to see patterns and insights."];
    
    const insights = [];
    if (avgIntensity > 7) {
      insights.push("Your emotional intensity has been high recently. Consider stress management techniques.");
    }
    if (topMood === 'anxious') {
      insights.push("Anxiety appears frequently. Try breathing exercises or reach out for support.");
    }
    if (topMood === 'happy') {
      insights.push("Great to see positive emotions! Keep up what's working for you.");
    }
    
    return insights.length > 0 ? insights : ["Your mood patterns look balanced. Keep monitoring your emotional well-being."];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Mood Analytics</h2>
          <p className="text-muted-foreground">Track your emotional patterns over time</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Intensity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: avgIntensity > 7 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))' }}>
              {avgIntensity.toFixed(1)}/10
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Mood</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize" style={{ color: getEmotionColor(topMood) }}>
              {topMood}
            </div>
            <p className="text-xs text-muted-foreground">Recent pattern</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries Logged</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{moodData.length}</div>
            <p className="text-xs text-muted-foreground">Total recorded</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personal Insights
          </CardTitle>
          <CardDescription>AI-powered analysis of your emotional patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getInsights().map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
            <CardDescription>Your latest emotional check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {moodData.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" style={{ color: getEmotionColor(entry.mood) }}>
                      {entry.mood}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {entry.intensity}/10
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};