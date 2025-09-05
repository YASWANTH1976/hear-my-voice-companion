import React, { useState } from 'react';
import { ExternalLink, Phone, MessageCircle, Book, Video, Headphones, Heart, Shield, Clock, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useVoice } from '@/context/VoiceContext';

export const ResourceCenter: React.FC = () => {
  const { currentEmotion, responseHistory } = useVoice();
  const [openSections, setOpenSections] = useState<string[]>(['crisis']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Crisis resources - always visible
  const crisisResources = [
    {
      name: 'AASRA (India)',
      description: '24/7 suicide prevention helpline',
      contact: '91529 87821',
      type: 'phone',
      urgent: true
    },
    {
      name: 'Vandrevala Foundation',
      description: 'Free 24/7 mental health support',
      contact: '9999 666 555',
      type: 'phone',
      urgent: true
    },
    {
      name: 'iCall (Mumbai)',
      description: 'Psychosocial helpline',
      contact: '9152 987 821',
      type: 'phone',
      urgent: true
    },
    {
      name: 'International Crisis Text Line',
      description: 'Text HOME to get support',
      contact: '741741',
      type: 'text',
      urgent: true
    }
  ];

  // Professional help resources
  const professionalResources = [
    {
      name: 'Psychology Today India',
      description: 'Find therapists and counselors near you',
      url: 'https://www.psychologytoday.com',
      icon: ExternalLink
    },
    {
      name: 'Practo Mental Health',
      description: 'Online therapy and psychiatrist consultations',
      url: 'https://www.practo.com',
      icon: Video
    },
    {
      name: 'BetterHelp',
      description: 'Professional online therapy',
      url: 'https://www.betterhelp.com',
      icon: MessageCircle
    },
    {
      name: 'Talkspace',
      description: 'Text and video therapy sessions',
      url: 'https://www.talkspace.com',
      icon: MessageCircle
    }
  ];

  // Self-help resources based on current emotion
  const getSelfHelpResources = () => {
    const emotion = currentEmotion?.type || 'general';
    
    const resourcesByEmotion = {
      anxiety: [
        {
          title: '4-7-8 Breathing Technique',
          description: 'Inhale for 4, hold for 7, exhale for 8 seconds',
          type: 'technique',
          icon: Headphones
        },
        {
          title: 'Progressive Muscle Relaxation',
          description: 'Tense and release each muscle group',
          type: 'technique',
          icon: Heart
        },
        {
          title: 'Grounding Technique (5-4-3-2-1)',
          description: '5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste',
          type: 'technique',
          icon: Book
        }
      ],
      sadness: [
        {
          title: 'Gentle Movement',
          description: 'Light exercise like walking or stretching',
          type: 'activity',
          icon: Heart
        },
        {
          title: 'Journaling',
          description: 'Write down your thoughts and feelings',
          type: 'activity',
          icon: Book
        },
        {
          title: 'Connection with Nature',
          description: 'Spend time outdoors or with plants',
          type: 'activity',
          icon: Heart
        }
      ],
      anger: [
        {
          title: 'Cool-Down Technique',
          description: 'Count to 10, take deep breaths, step away',
          type: 'technique',
          icon: Clock
        },
        {
          title: 'Physical Release',
          description: 'Exercise, punch a pillow, or do vigorous activity',
          type: 'activity',
          icon: Heart
        },
        {
          title: 'Express Through Writing',
          description: 'Write an angry letter (don\'t send it)',
          type: 'activity',
          icon: Book
        }
      ],
      stress: [
        {
          title: 'Time Management',
          description: 'Break tasks into smaller, manageable pieces',
          type: 'technique',
          icon: Clock
        },
        {
          title: 'Meditation or Mindfulness',
          description: 'Even 5 minutes can help reset your mind',
          type: 'technique',
          icon: Headphones
        },
        {
          title: 'Boundary Setting',
          description: 'Learn to say no and protect your energy',
          type: 'technique',
          icon: Shield
        }
      ],
      general: [
        {
          title: 'Daily Gratitude Practice',
          description: 'Write down 3 things you\'re grateful for each day',
          type: 'activity',
          icon: Heart
        },
        {
          title: 'Mindful Breathing',
          description: 'Focus on your breath for a few minutes',
          type: 'technique',
          icon: Headphones
        },
        {
          title: 'Self-Compassion',
          description: 'Treat yourself with the same kindness you\'d show a friend',
          type: 'mindset',
          icon: Heart
        }
      ]
    };

    return resourcesByEmotion[emotion] || resourcesByEmotion.general;
  };

  const selfHelpResources = getSelfHelpResources();

  // Educational resources
  const educationalResources = [
    {
      title: 'Understanding Mental Health',
      description: 'Comprehensive guide to mental wellness',
      url: '#',
      type: 'article'
    },
    {
      title: 'Stress Management Techniques',
      description: 'Evidence-based methods for managing stress',
      url: '#',
      type: 'guide'
    },
    {
      title: 'Building Resilience',
      description: 'Develop coping skills for life\'s challenges',
      url: '#',
      type: 'course'
    },
    {
      title: 'Sleep Hygiene Guide',
      description: 'Improve your sleep for better mental health',
      url: '#',
      type: 'guide'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Crisis Resources - Always Visible */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <Shield className="h-5 w-5" />
            <span>Crisis Support - Available 24/7</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {crisisResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div className="flex-1">
                <h4 className="font-medium text-red-900">{resource.name}</h4>
                <p className="text-sm text-red-700">{resource.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {resource.type === 'phone' && <Phone className="h-4 w-4 text-red-600" />}
                {resource.type === 'text' && <MessageCircle className="h-4 w-4 text-red-600" />}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-800 border-red-300 hover:bg-red-100"
                  onClick={() => {
                    if (resource.type === 'phone') {
                      window.open(`tel:${resource.contact}`);
                    } else {
                      window.open(`sms:${resource.contact}`);
                    }
                  }}
                >
                  {resource.contact}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Self-Help Techniques */}
      <Collapsible open={openSections.includes('selfhelp')} onOpenChange={() => toggleSection('selfhelp')}>
        <Card className="card-hover">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="gradient-primary p-2 rounded-lg">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span>Self-Help Techniques</span>
                  {currentEmotion && (
                    <Badge variant="outline" className="capitalize">
                      For {currentEmotion.type}
                    </Badge>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('selfhelp') ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {selfHelpResources.map((resource, index) => (
                <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-start space-x-3">
                    <resource.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Professional Help */}
      <Collapsible open={openSections.includes('professional')} onOpenChange={() => toggleSection('professional')}>
        <Card className="card-hover">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="gradient-primary p-2 rounded-lg">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <span>Professional Support</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('professional') ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {professionalResources.map((resource, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <resource.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.open(resource.url, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Educational Resources */}
      <Collapsible open={openSections.includes('education')} onOpenChange={() => toggleSection('education')}>
        <Card className="card-hover">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="gradient-primary p-2 rounded-lg">
                    <Book className="h-4 w-4 text-white" />
                  </div>
                  <span>Learn & Understand</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('education') ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {educationalResources.map((resource, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Book className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};