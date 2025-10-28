import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, Heart, Zap, Moon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Exercise {
  id: string;
  name: string;
  type: 'breathing' | 'meditation' | 'grounding' | 'relaxation';
  duration: number;
  description: string;
  steps: string[];
  icon: React.ReactNode;
}

const WELLNESS_EXERCISES: Exercise[] = [
  {
    id: 'box-breathing',
    name: '4-7-8 शांति सांस (Calm Breathing)',
    type: 'breathing',
    duration: 300, // 5 minutes
    description: 'Deep breathing technique to reduce anxiety and promote relaxation',
    steps: [
      'Sit comfortably with your back straight',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat the cycle'
    ],
    icon: <Wind className="h-5 w-5" />
  },
  {
    id: 'body-scan',
    name: 'शरीर स्कैन ध्यान (Body Scan Meditation)',
    type: 'meditation',
    duration: 600, // 10 minutes
    description: 'Progressive relaxation technique focusing on different body parts',
    steps: [
      'Lie down in a comfortable position',
      'Close your eyes and take deep breaths',
      'Start from the top of your head',
      'Slowly move attention down your body',
      'Notice any tension and let it go',
      'End at your toes, feeling completely relaxed'
    ],
    icon: <Heart className="h-5 w-5" />
  },
  {
    id: '5-4-3-2-1',
    name: '5-4-3-2-1 ग्राउंडिंग (Grounding Technique)',
    type: 'grounding',
    duration: 180, // 3 minutes
    description: 'Sensory grounding technique to manage anxiety and panic',
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take slow, deep breaths throughout'
    ],
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: 'progressive-relaxation',
    name: 'प्रगतिशील मांसपेशी छूट (Progressive Muscle Relaxation)',
    type: 'relaxation',
    duration: 900, // 15 minutes
    description: 'Systematic tensing and relaxing of muscle groups',
    steps: [
      'Start with your feet - tense for 5 seconds',
      'Relax and notice the difference',
      'Move up to your calves, then thighs',
      'Continue with abdomen, chest, arms',
      'Finish with face and head muscles',
      'End with whole body relaxation'
    ],
    icon: <Moon className="h-5 w-5" />
  }
];

export const WellnessExercises: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            // Exercise completed
            handleExerciseComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const pauseResume = () => {
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    setIsRunning(false);
    setTimeLeft(activeExercise?.duration || 0);
    setCurrentStep(0);
  };

  const handleExerciseComplete = () => {
    // Save completion to localStorage for tracking
    const completions = JSON.parse(localStorage.getItem('wellness-completions') || '[]');
    completions.push({
      exerciseId: activeExercise?.id,
      completedAt: new Date().toISOString(),
      duration: activeExercise?.duration
    });
    localStorage.setItem('wellness-completions', JSON.stringify(completions));

    // Show completion message
    alert('Exercise completed! Great job taking care of your mental health. 🌟');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: Exercise['type']) => {
    const colors = {
      breathing: 'hsl(var(--chart-1))',
      meditation: 'hsl(var(--chart-2))',
      grounding: 'hsl(var(--chart-3))',
      relaxation: 'hsl(var(--chart-4))'
    };
    return colors[type];
  };

  const getTypeLabel = (type: Exercise['type']) => {
    const labels = {
      breathing: 'श्वास (Breathing)',
      meditation: 'ध्यान (Meditation)', 
      grounding: 'ग्राउंडिंग (Grounding)',
      relaxation: 'आराम (Relaxation)'
    };
    return labels[type];
  };

  if (activeExercise) {
    const progress = ((activeExercise.duration - timeLeft) / activeExercise.duration) * 100;
    
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                 style={{ backgroundColor: `${getTypeColor(activeExercise.type)}20`, color: getTypeColor(activeExercise.type) }}>
              {activeExercise.icon}
            </div>
            <CardTitle className="text-xl">{activeExercise.name}</CardTitle>
            <CardDescription>{activeExercise.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Exercise Steps:</h3>
              <div className="space-y-2">
                {activeExercise.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      index === currentStep 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        index === currentStep 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </span>
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={pauseResume}
                variant={isRunning ? "outline" : "default"}
                className="flex-1"
              >
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              
              <Button onClick={resetExercise} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => {
                setActiveExercise(null);
                setIsRunning(false);
              }}
            >
              Exit Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Wellness Exercises</h2>
        <p className="text-muted-foreground">Guided exercises to help manage stress and improve mental well-being</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="grounding">Grounding</TabsTrigger>
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {WELLNESS_EXERCISES.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} onStart={startExercise} />
            ))}
          </div>
        </TabsContent>

        {['breathing', 'meditation', 'grounding', 'relaxation'].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {WELLNESS_EXERCISES.filter(ex => ex.type === type).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} onStart={startExercise} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const ExerciseCard: React.FC<{ 
  exercise: Exercise; 
  onStart: (exercise: Exercise) => void; 
}> = ({ exercise, onStart }) => {
  const getTypeColor = (type: Exercise['type']) => {
    const colors = {
      breathing: 'hsl(var(--chart-1))',
      meditation: 'hsl(var(--chart-2))',
      grounding: 'hsl(var(--chart-3))',
      relaxation: 'hsl(var(--chart-4))'
    };
    return colors[type];
  };

  const getTypeLabel = (type: Exercise['type']) => {
    const labels = {
      breathing: 'श्वास (Breathing)',
      meditation: 'ध्यान (Meditation)', 
      grounding: 'ग्राउंडिंग (Grounding)',
      relaxation: 'आराम (Relaxation)'
    };
    return labels[type];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${getTypeColor(exercise.type)}20`, color: getTypeColor(exercise.type) }}
            >
              {exercise.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
              <Badge variant="outline" style={{ color: getTypeColor(exercise.type) }}>
                {getTypeLabel(exercise.type)}
              </Badge>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{formatDuration(exercise.duration)}</span>
        </div>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">What you'll do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {exercise.steps.slice(0, 3).map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  {step}
                </li>
              ))}
              {exercise.steps.length > 3 && (
                <li className="text-xs text-muted-foreground/70">
                  +{exercise.steps.length - 3} more steps...
                </li>
              )}
            </ul>
          </div>
          
          <Button 
            className="w-full" 
            onClick={() => onStart(exercise)}
            style={{ backgroundColor: getTypeColor(exercise.type) }}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};