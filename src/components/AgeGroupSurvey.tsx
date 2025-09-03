import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Users, BarChart3, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyData {
  ageGroup: string;
  primaryConcerns: string[];
  preferredFeatures: string[];
  usageFrequency: string;
  helpfulnessRating: number;
  suggestions: string;
  timestamp: Date;
}

const AGE_GROUPS = [
  { value: '13-17', label: '13-17 years (Teenagers)' },
  { value: '18-25', label: '18-25 years (Young Adults)' },
  { value: '26-35', label: '26-35 years (Adults)' },
  { value: '36-50', label: '36-50 years (Middle-aged)' },
  { value: '51-65', label: '51-65 years (Mature Adults)' },
  { value: '65+', label: '65+ years (Seniors)' }
];

const PRIMARY_CONCERNS = [
  'Anxiety and Stress',
  'Depression and Sadness',
  'Work-Life Balance',
  'Relationship Issues',
  'Academic Pressure',
  'Financial Stress',
  'Health Concerns',
  'Social Isolation',
  'Career Uncertainty',
  'Family Problems'
];

const PREFERRED_FEATURES = [
  'Voice Interaction',
  'Mood Tracking',
  'AI Chatbot',
  'Breathing Exercises',
  'Meditation Guides',
  'Journal Writing',
  'Crisis Resources',
  'Multilingual Support',
  'Privacy Features',
  'Quick Exit Button'
];

const USAGE_FREQUENCY = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'first-time', label: 'First time user' }
];

export const AgeGroupSurvey: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Check if user has already completed survey
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(() => {
    return localStorage.getItem('surveyCompleted') === 'true';
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateSurveyData = (key: keyof SurveyData, value: any) => {
    setSurveyData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitSurvey = () => {
    const completeSurveyData: SurveyData = {
      ...surveyData,
      timestamp: new Date()
    } as SurveyData;

    // Save to local storage
    const existingSurveys = JSON.parse(localStorage.getItem('ageGroupSurveys') || '[]');
    existingSurveys.push(completeSurveyData);
    localStorage.setItem('ageGroupSurveys', JSON.stringify(existingSurveys));
    localStorage.setItem('surveyCompleted', 'true');

    setIsSubmitted(true);
    setHasCompletedSurvey(true);
    
    toast({
      title: "Survey Submitted!",
      description: "Thank you for helping us improve HearMeOut for your age group.",
    });
  };

  const resetSurvey = () => {
    localStorage.removeItem('surveyCompleted');
    setHasCompletedSurvey(false);
    setCurrentStep(0);
    setSurveyData({});
    setIsSubmitted(false);
  };

  if (hasCompletedSurvey && !isSubmitted) {
    return (
      <Card className="card-hover border-green-200 bg-green-50/50">
        <CardContent className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Thank You for Your Feedback!
          </h3>
          <p className="text-green-600 mb-4">
            You've already completed our age group survey. Your insights help us improve HearMeOut.
          </p>
          <Button onClick={resetSurvey} variant="outline" size="sm">
            Take Survey Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <Card className="card-hover border-green-200 bg-green-50/50">
        <CardContent className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Survey Submitted Successfully!
          </h3>
          <p className="text-green-600">
            Your feedback will help us create better mental health support for your age group.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's your age group?</h3>
            <RadioGroup
              value={surveyData.ageGroup}
              onValueChange={(value) => updateSurveyData('ageGroup', value)}
            >
              {AGE_GROUPS.map((group) => (
                <div key={group.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={group.value} id={group.value} />
                  <Label htmlFor={group.value}>{group.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What are your primary mental health concerns?</h3>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {PRIMARY_CONCERNS.map((concern) => (
                <Label
                  key={concern}
                  className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={surveyData.primaryConcerns?.includes(concern) || false}
                    onChange={(e) => {
                      const current = surveyData.primaryConcerns || [];
                      if (e.target.checked) {
                        updateSurveyData('primaryConcerns', [...current, concern]);
                      } else {
                        updateSurveyData('primaryConcerns', current.filter(c => c !== concern));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{concern}</span>
                </Label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Which features do you find most helpful?</h3>
            <p className="text-sm text-muted-foreground">Select your top 5 features</p>
            <div className="grid grid-cols-2 gap-2">
              {PREFERRED_FEATURES.map((feature) => (
                <Label
                  key={feature}
                  className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={surveyData.preferredFeatures?.includes(feature) || false}
                    onChange={(e) => {
                      const current = surveyData.preferredFeatures || [];
                      if (e.target.checked && current.length < 5) {
                        updateSurveyData('preferredFeatures', [...current, feature]);
                      } else if (!e.target.checked) {
                        updateSurveyData('preferredFeatures', current.filter(f => f !== feature));
                      }
                    }}
                    className="rounded"
                    disabled={!surveyData.preferredFeatures?.includes(feature) && (surveyData.preferredFeatures?.length || 0) >= 5}
                  />
                  <span className="text-sm">{feature}</span>
                </Label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {surveyData.preferredFeatures?.length || 0}/5
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How often would you use this app?</h3>
            <RadioGroup
              value={surveyData.usageFrequency}
              onValueChange={(value) => updateSurveyData('usageFrequency', value)}
            >
              {USAGE_FREQUENCY.map((freq) => (
                <div key={freq.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={freq.value} id={freq.value} />
                  <Label htmlFor={freq.value}>{freq.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How helpful do you find HearMeOut?</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Not helpful</span>
                <span>Extremely helpful</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <Button
                    key={rating}
                    variant={surveyData.helpfulnessRating === rating ? "default" : "outline"}
                    size="sm"
                    className="w-10 h-10"
                    onClick={() => updateSurveyData('helpfulnessRating', rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Any suggestions for improvement?</h3>
            <p className="text-sm text-muted-foreground">
              What features would make HearMeOut more helpful for your age group?
            </p>
            <Textarea
              placeholder="Share your thoughts, suggestions, or any features you'd like to see..."
              value={surveyData.suggestions || ''}
              onChange={(e) => updateSurveyData('suggestions', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!surveyData.ageGroup;
      case 1: return (surveyData.primaryConcerns?.length || 0) > 0;
      case 2: return (surveyData.preferredFeatures?.length || 0) > 0;
      case 3: return !!surveyData.usageFrequency;
      case 4: return !!surveyData.helpfulnessRating;
      case 5: return true; // Suggestions are optional
      default: return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Age Group Survey</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Step {currentStep + 1} of {totalSteps}</span>
            </div>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Help us understand how different age groups use HearMeOut
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>

            {currentStep === totalSteps - 1 ? (
              <Button
                onClick={submitSurvey}
                disabled={!canProceed()}
                className="gradient-primary text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Survey
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="gradient-primary text-white"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};