import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, Calendar } from 'lucide-react';

interface MoodData {
  mood: number;
  energy: number;
  stress: number;
  date: string;
}

const MOOD_LEVELS = [
  { value: 1, emoji: '😢', label: 'Very Low', color: 'bg-red-500' },
  { value: 2, emoji: '😟', label: 'Low', color: 'bg-orange-500' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'bg-green-500' },
  { value: 5, emoji: '😊', label: 'Great', color: 'bg-emerald-500' },
];

export const QuickMoodCheck: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState<number | null>(null);
  const [currentStress, setCurrentStress] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>(() => {
    const saved = localStorage.getItem('moodCheckHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const submitMoodCheck = () => {
    if (currentMood && currentEnergy && currentStress) {
      const newEntry: MoodData = {
        mood: currentMood,
        energy: currentEnergy,
        stress: currentStress,
        date: new Date().toISOString().split('T')[0]
      };

      // Remove entry for today if exists, then add new one
      const updatedHistory = [
        newEntry,
        ...moodHistory.filter(entry => entry.date !== newEntry.date)
      ].slice(0, 30); // Keep last 30 days

      setMoodHistory(updatedHistory);
      localStorage.setItem('moodCheckHistory', JSON.stringify(updatedHistory));
      setIsSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCurrentMood(null);
        setCurrentEnergy(null);
        setCurrentStress(null);
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const getTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === today);
  };

  const getWeeklyAverage = () => {
    const lastWeek = moodHistory.slice(0, 7);
    if (lastWeek.length === 0) return null;
    
    const avgMood = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
    const avgEnergy = lastWeek.reduce((sum, entry) => sum + entry.energy, 0) / lastWeek.length;
    const avgStress = lastWeek.reduce((sum, entry) => sum + entry.stress, 0) / lastWeek.length;
    
    return { mood: avgMood, energy: avgEnergy, stress: avgStress };
  };

  const todayEntry = getTodayEntry();
  const weeklyAvg = getWeeklyAverage();

  if (isSubmitted) {
    return (
      <Card className="card-hover border-green-200 bg-green-50/50">
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Thank you for checking in!
          </h3>
          <p className="text-green-600">
            Your mood data has been saved. Remember, tracking your emotions helps you understand patterns.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (todayEntry && !currentMood) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Today's Mood Check ✓
              </CardTitle>
              <CardDescription>
                You've already checked in today. Here's your status:
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMood(1)}
            >
              Update
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl">
                {MOOD_LEVELS.find(l => l.value === todayEntry.mood)?.emoji}
              </div>
              <div className="text-sm font-medium">Mood</div>
              <div className="text-xs text-muted-foreground">
                {MOOD_LEVELS.find(l => l.value === todayEntry.mood)?.label}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">⚡</div>
              <div className="text-sm font-medium">Energy</div>
              <Progress value={todayEntry.energy * 20} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl">📊</div>
              <div className="text-sm font-medium">Stress</div>
              <Progress value={todayEntry.stress * 20} className="h-2" />
            </div>
          </div>

          {weeklyAvg && (
            <div className="border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <TrendingUp className="mr-1 h-4 w-4" />
                7-Day Average
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium">Mood</div>
                  <div className="text-lg">{weeklyAvg.mood.toFixed(1)}/5</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Energy</div>
                  <div className="text-lg">{weeklyAvg.energy.toFixed(1)}/5</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Stress</div>
                  <div className="text-lg">{weeklyAvg.stress.toFixed(1)}/5</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500" />
          Quick Mood Check
        </CardTitle>
        <CardDescription>
          Take a moment to check in with yourself. How are you feeling right now?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Overall Mood</label>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_LEVELS.map((level) => (
              <Button
                key={level.value}
                variant={currentMood === level.value ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col gap-1 ${
                  currentMood === level.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCurrentMood(level.value)}
              >
                <span className="text-xl">{level.emoji}</span>
                <span className="text-xs">{level.value}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Energy Level: {currentEnergy ? `${currentEnergy}/5` : 'Not set'}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={currentEnergy === level ? "default" : "outline"}
                className={`h-10 ${currentEnergy === level ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCurrentEnergy(level)}
              >
                {level}
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Drained</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Stress Level: {currentStress ? `${currentStress}/5` : 'Not set'}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={currentStress === level ? "default" : "outline"}
                className={`h-10 ${currentStress === level ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCurrentStress(level)}
              >
                {level}
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Relaxed</span>
            <span>Overwhelmed</span>
          </div>
        </div>

        <Button 
          onClick={submitMoodCheck}
          disabled={!currentMood || !currentEnergy || !currentStress}
          className="w-full gradient-primary text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Save Today's Check-in
        </Button>
      </CardContent>
    </Card>
  );
};