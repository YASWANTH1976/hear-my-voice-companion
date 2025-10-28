import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  Brain, 
  Heart, 
  Sparkles, 
  Anchor,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Strategy {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  duration: number; // in seconds
  steps: string[];
  audioInstructions: string[];
}

const strategies: Strategy[] = [
  {
    id: 'breathing',
    title: '4-7-8 Breathing',
    description: 'Calm your nervous system with controlled breathing',
    icon: Waves,
    color: 'wellness-breathing',
    duration: 240, // 4 minutes
    steps: [
      'Sit comfortably with your back straight',
      'Place the tip of your tongue against your teeth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat the cycle 4 times'
    ],
    audioInstructions: [
      'Welcome to the 4-7-8 breathing exercise. Find a comfortable position and close your eyes if you feel comfortable.',
      'Place the tip of your tongue against the ridge behind your upper teeth. This will stay there throughout the exercise.',
      'Let\'s begin. Inhale quietly through your nose for 4 counts. One... two... three... four.',
      'Now hold your breath for 7 counts. One... two... three... four... five... six... seven.',
      'Exhale completely through your mouth for 8 counts. One... two... three... four... five... six... seven... eight.',
      'Excellent. Let\'s repeat this cycle. Inhale for 4... Hold for 7... Exhale for 8.',
      'Continue this pattern. Focus only on your breath and the counting.',
      'You\'re doing wonderfully. Feel your body relaxing with each exhale.',
      'Final cycle. Breathe in... hold... and release.',
      'Take a moment to notice how you feel. Your nervous system is now calmer and more balanced.'
    ]
  },
  {
    id: 'meditation',
    title: '5-Minute Mindfulness',
    description: 'Ground yourself in the present moment',
    icon: Brain,
    color: 'wellness-meditation',
    duration: 300, // 5 minutes
    steps: [
      'Find a quiet, comfortable space',
      'Close your eyes or soften your gaze',
      'Focus on your natural breathing',
      'Notice thoughts without judgment',
      'Return attention to your breath',
      'End with gratitude'
    ],
    audioInstructions: [
      'Welcome to this 5-minute mindfulness meditation. Find a comfortable position where you won\'t be disturbed.',
      'Gently close your eyes or soften your gaze downward. Let your hands rest naturally.',
      'Begin by taking three deep breaths. In... and out. In... and out. In... and out.',
      'Now let your breathing return to its natural rhythm. Simply observe each breath as it flows in and out.',
      'Notice the sensation of breathing. The air entering your nostrils, filling your lungs, and gently leaving.',
      'Your mind may wander to thoughts, and that\'s perfectly normal. When you notice this, gently return to your breath.',
      'You\'re not trying to stop thinking. You\'re simply practicing awareness of the present moment.',
      'If emotions arise, acknowledge them with kindness, like clouds passing through the sky.',
      'Continue to breathe naturally. Each breath is an anchor to this moment.',
      'Feel your body relaxing. Let go of any tension in your shoulders, jaw, and face.',
      'We\'re halfway through. You\'re doing beautifully. Stay present with your breath.',
      'Notice the space between thoughts. Rest in that peaceful awareness.',
      'As we near the end, take a moment to appreciate this time you\'ve given yourself.',
      'Slowly begin to wiggle your fingers and toes. When you\'re ready, gently open your eyes.',
      'Carry this sense of peace and awareness with you into your day.'
    ]
  },
  {
    id: 'relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Release physical tension throughout your body',
    icon: Heart,
    color: 'wellness-relaxation',
    duration: 480, // 8 minutes
    steps: [
      'Lie down or sit comfortably',
      'Start with your toes and feet',
      'Tense each muscle group for 5 seconds',
      'Release and notice the relaxation',
      'Work your way up your body',
      'End with your face and scalp'
    ],
    audioInstructions: [
      'Welcome to progressive muscle relaxation. This exercise will help release tension from your entire body.',
      'Find a comfortable position lying down or sitting. Close your eyes and take three deep breaths.',
      'We\'ll start with your feet. Curl your toes tightly and tense all the muscles in your feet. Hold for 5 seconds.',
      'Now release and let your feet completely relax. Notice the difference between tension and relaxation.',
      'Move to your calf muscles. Tense them by pointing your toes toward your shins. Hold... and release.',
      'Feel the tension melting away from your calves. Let them become completely loose and heavy.',
      'Now your thigh muscles. Press your knees together and tense your thighs. Hold... and release.',
      'Notice how relaxed your entire legs feel now. Heavy and completely at ease.',
      'Tense your buttock muscles. Squeeze tightly... hold... and release.',
      'Now your abdomen. Pull your belly button toward your spine. Hold... and release.',
      'Clench your fists and tense your entire arms. Squeeze tight... hold... and release.',
      'Let your arms fall loose at your sides. Feel the relaxation flowing through them.',
      'Raise your shoulders toward your ears. Hold the tension... and release.',
      'Scrunch up your face muscles. Squeeze your eyes, wrinkle your forehead... and release.',
      'Take a moment to scan your entire body. Notice how relaxed and peaceful you feel.',
      'Breathe naturally and enjoy this feeling of complete relaxation.'
    ]
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: 'Shift focus to positive aspects of your life',
    icon: Sparkles,
    color: 'wellness-gratitude',
    duration: 180, // 3 minutes
    steps: [
      'Reflect on three things you\'re grateful for',
      'Think about why each one matters',
      'Feel the positive emotions',
      'Share gratitude with someone',
      'Write it down if possible',
      'Carry this feeling forward'
    ],
    audioInstructions: [
      'Welcome to this gratitude practice. Gratitude can shift our perspective and improve our mood.',
      'Take a few deep breaths and bring to mind something you\'re grateful for today.',
      'It could be something big or small. Perhaps a person, an experience, or even something simple like a warm cup of coffee.',
      'Really think about why you\'re grateful for this. How does it benefit your life?',
      'Feel the warmth of gratitude in your heart. Let it grow and expand.',
      'Now think of a second thing you\'re grateful for. Again, consider why it matters to you.',
      'Allow yourself to fully experience the positive emotions that come with gratitude.',
      'Finally, bring to mind a third thing you appreciate in your life.',
      'Notice how focusing on gratitude changes how you feel in this moment.',
      'Consider sharing your gratitude with someone today - it multiplies the positive impact.',
      'Take these feelings of appreciation with you as you continue your day.',
      'Remember, you can return to this practice whenever you need a positive shift in perspective.'
    ]
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to connect with the present',
    icon: Anchor,
    color: 'wellness-grounding',
    duration: 300, // 5 minutes
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take three deep breaths'
    ],
    audioInstructions: [
      'Welcome to the 5-4-3-2-1 grounding technique. This will help you connect with the present moment using your senses.',
      'Start by taking three deep breaths. In... and out. In... and out. In... and out.',
      'Now, look around you and identify 5 things you can see. Take your time with each one.',
      'Really observe them. Notice their colors, shapes, textures. Say them out loud if you\'d like.',
      'Next, identify 4 things you can physically touch or feel. This could be your clothes, a chair, the temperature.',
      'Focus on the textures and sensations. How do they feel against your skin?',
      'Now listen carefully and identify 3 things you can hear. Maybe it\'s traffic, birds, or the hum of electronics.',
      'Don\'t judge the sounds, just notice them as they come and go.',
      'Next, identify 2 things you can smell. Take a gentle breath in and notice any scents around you.',
      'Finally, identify 1 thing you can taste. It might be lingering from something you drank or just the taste in your mouth.',
      'Take a moment to notice how you feel now compared to when we started.',
      'This grounding technique can help you feel more present and calm whenever you need it.',
      'Remember, you can use this anywhere, anytime you feel overwhelmed or disconnected.'
    ]
  }
];

interface StrategySession {
  strategy: Strategy;
  isActive: boolean;
  currentStep: number;
  timeElapsed: number;
  isCompleted: boolean;
}

export const CopingStrategies: React.FC = () => {
  const { currentEmotion, selectedLanguage } = useVoice();
  const [activeSession, setActiveSession] = useState<StrategySession | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  // Get emotion-specific strategies
  const getRecommendedStrategies = () => {
    if (!currentEmotion) return strategies;

    const recommendations = {
      anxiety: ['breathing', 'grounding', 'meditation'],
      stress: ['breathing', 'relaxation', 'meditation'],
      sadness: ['gratitude', 'meditation', 'relaxation'],
      anger: ['breathing', 'relaxation', 'grounding'],
      confusion: ['grounding', 'meditation', 'gratitude'],
      happiness: ['gratitude', 'meditation']
    };

    const recommended = recommendations[currentEmotion.type] || [];
    const sortedStrategies = [...strategies].sort((a, b) => {
      const aIndex = recommended.indexOf(a.id);
      const bIndex = recommended.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return sortedStrategies;
  };

  const startStrategy = async (strategy: Strategy) => {
    if (activeSession?.isActive) {
      stopStrategy();
    }

    const session: StrategySession = {
      strategy,
      isActive: true,
      currentStep: 0,
      timeElapsed: 0,
      isCompleted: false
    };

    setActiveSession(session);
    await speakInstruction(strategy.audioInstructions[0]);
    startSessionTimer(session);
  };

  const stopStrategy = () => {
    if (sessionTimer) {
      clearInterval(sessionTimer);
      setSessionTimer(null);
    }
    speechSynthesis.cancel();
    setActiveSession(null);
  };

  const startSessionTimer = (session: StrategySession) => {
    const timer = setInterval(() => {
      setActiveSession(prev => {
        if (!prev) return null;

        const newTimeElapsed = prev.timeElapsed + 1;
        const progress = newTimeElapsed / session.strategy.duration;

        // Check if we need to move to next instruction
        const instructionInterval = session.strategy.duration / session.strategy.audioInstructions.length;
        const targetStep = Math.floor(newTimeElapsed / instructionInterval);

        if (targetStep > prev.currentStep && targetStep < session.strategy.audioInstructions.length) {
          speakInstruction(session.strategy.audioInstructions[targetStep]);
          return {
            ...prev,
            currentStep: targetStep,
            timeElapsed: newTimeElapsed
          };
        }

        // Check if completed
        if (newTimeElapsed >= session.strategy.duration) {
          clearInterval(timer);
          setSessionTimer(null);
          return {
            ...prev,
            isActive: false,
            isCompleted: true,
            timeElapsed: session.strategy.duration
          };
        }

        return {
          ...prev,
          timeElapsed: newTimeElapsed
        };
      });
    }, 1000);

    setSessionTimer(timer);
  };

  const speakInstruction = async (instruction: string) => {
    return new Promise<void>((resolve) => {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.8; // Slower for meditation
      utterance.pitch = 1;
      utterance.volume = 0.9;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      speechSynthesis.speak(utterance);
    });
  };

  const resetStrategy = () => {
    setActiveSession(null);
    if (sessionTimer) {
      clearInterval(sessionTimer);
      setSessionTimer(null);
    }
    speechSynthesis.cancel();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionTimer) {
        clearInterval(sessionTimer);
      }
      speechSynthesis.cancel();
    };
  }, [sessionTimer]);

  const recommendedStrategies = getRecommendedStrategies();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Wellness Strategies</h2>
        <p className="text-muted-foreground">
          {currentEmotion 
            ? `Personalized techniques for ${currentEmotion.type}` 
            : 'Interactive coping techniques to support your mental wellbeing'
          }
        </p>
      </div>

      {/* Active Session */}
      {activeSession && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <activeSession.strategy.icon className="h-5 w-5 text-primary" />
                <span>{activeSession.strategy.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                {activeSession.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : activeSession.isActive ? (
                  <Button variant="outline" size="sm" onClick={stopStrategy}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" onClick={resetStrategy}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {Math.floor(activeSession.timeElapsed / 60)}:
                  {(activeSession.timeElapsed % 60).toString().padStart(2, '0')} / 
                  {Math.floor(activeSession.strategy.duration / 60)}:
                  {(activeSession.strategy.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Progress 
                value={(activeSession.timeElapsed / activeSession.strategy.duration) * 100} 
                className="h-3"
              />
            </div>

            {/* Current Step */}
            <div className="p-4 bg-white/80 rounded-lg">
              <h4 className="font-medium mb-2">Current Step:</h4>
              <p className="text-foreground/80">
                {activeSession.strategy.steps[Math.min(activeSession.currentStep, activeSession.strategy.steps.length - 1)]}
              </p>
            </div>

            {/* Completion Message */}
            {activeSession.isCompleted && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  🎉 Great job! You've completed the {activeSession.strategy.title} exercise. 
                  Take a moment to notice how you feel.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedStrategies.map((strategy, index) => {
          const isRecommended = currentEmotion && index < 3;
          
          return (
            <Card 
              key={strategy.id} 
              className={`
                card-hover relative
                ${isRecommended ? 'ring-2 ring-primary/30 border-primary/30' : ''}
              `}
            >
              {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `hsl(var(--${strategy.color}))` }}
                  >
                    <strategy.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg">{strategy.title}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {Math.floor(strategy.duration / 60)} min
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {strategy.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Steps:</h4>
                  <ul className="space-y-1">
                    {strategy.steps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                    {strategy.steps.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{strategy.steps.length - 3} more steps
                      </li>
                    )}
                  </ul>
                </div>

                <Button 
                  onClick={() => startStrategy(strategy)}
                  disabled={activeSession?.isActive && activeSession.strategy.id !== strategy.id}
                  className="w-full"
                  style={{ backgroundColor: `hsl(var(--${strategy.color}))` }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency Resources */}
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-800">
              🆘 Need Immediate Support?
            </h3>
            <p className="text-red-700 text-sm">
              If you're in crisis or need immediate help, please reach out to a mental health professional or crisis helpline.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" size="sm" className="border-red-300 text-red-700">
                <a href="tel:1800-599-0019">
                  📞 NIMH Helpline: 1800-599-0019
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-red-300 text-red-700">
                <a href="tel:080-46110007">
                  📞 NIMHANS: 080-46110007
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};