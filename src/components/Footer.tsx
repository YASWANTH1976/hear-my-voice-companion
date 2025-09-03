import React from 'react';
import { Phone, Shield, Heart, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const helplines = [
  {
    name: 'National Mental Health Programme',
    number: '1800-599-0019',
    description: '24/7 mental health support',
    type: 'primary'
  },
  {
    name: 'NIMHANS Helpline',
    number: '080-46110007',
    description: 'Professional psychiatric support',
    type: 'primary'
  },
  {
    name: 'Sneha India',
    number: '044-24640050',
    description: 'Emotional support and suicide prevention',
    type: 'crisis'
  },
  {
    name: 'iCall Psychosocial Helpline',
    number: '022-25521111',
    description: 'Counseling and mental health support',
    type: 'primary'
  }
];

export const Footer: React.FC = () => {
  return (
    <footer 
      className="w-full bg-muted/30 border-t border-border mt-16"
      role="contentinfo"
      aria-label="Site footer with mental health resources"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        
        {/* Mental Health Resources */}
        <div className="space-y-6" role="region" aria-labelledby="resources-heading">
          <div className="text-center space-y-2">
            <h2 
              id="resources-heading"
              className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2"
            >
              <Phone className="h-6 w-6 text-primary" />
              <span>Mental Health Resources</span>
            </h2>
            <p className="text-muted-foreground">
              Professional help is available 24/7. Don't hesitate to reach out.
            </p>
          </div>

          {/* Helpline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helplines.map((helpline, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`
                      p-2 rounded-lg
                      ${helpline.type === 'crisis' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}
                    `}>
                      {helpline.type === 'crisis' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Phone className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">{helpline.name}</h3>
                      <p className="text-sm text-muted-foreground">{helpline.description}</p>
                      
                      <Button 
                        asChild 
                        variant={helpline.type === 'crisis' ? 'destructive' : 'default'}
                        size="sm"
                        className="w-full"
                        aria-label={`Call ${helpline.name} at ${helpline.number}`}
                      >
                        <a href={`tel:${helpline.number}`} className="flex items-center justify-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{helpline.number}</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Important Disclaimers */}
        <div className="space-y-6">
          <Card 
            className="border-yellow-200 bg-yellow-50/50"
            role="region"
            aria-labelledby="disclaimer-heading"
          >
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-yellow-600 mt-1" />
                <div className="space-y-2">
                  <h3 
                    id="disclaimer-heading"
                    className="font-semibold text-yellow-800"
                  >
                    Important Medical Disclaimer
                  </h3>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <p>
                      <strong>HearMeOut is not a substitute for professional medical advice, diagnosis, or treatment.</strong> 
                      Always seek the advice of qualified mental health professionals with any questions you may have regarding a medical condition.
                    </p>
                    <p>
                      This AI companion provides supportive conversation and wellness techniques, but cannot replace 
                      professional therapy, counseling, or psychiatric care.
                    </p>
                    <p>
                      <strong>In case of emergency or suicidal thoughts, immediately contact emergency services or the crisis helplines above.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data Protection */}
          <Card 
            className="border-green-200 bg-green-50/50"
            role="region"
            aria-labelledby="privacy-heading"
          >
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-600 mt-1" />
                <div className="space-y-2">
                  <h3 
                    id="privacy-heading"
                    className="font-semibold text-green-800"
                  >
                    Your Privacy is Protected
                  </h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>✅ <strong>100% Anonymous:</strong> No personal data is collected or stored</p>
                    <p>✅ <strong>Local Processing:</strong> All analysis happens in your browser</p>
                    <p>✅ <strong>No Server Storage:</strong> Conversations are not saved anywhere</p>
                    <p>✅ <strong>No Tracking:</strong> We don't track your usage or behavior</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Footer Bottom */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Heart className="h-5 w-5" />
            <span className="text-lg font-semibold">HearMeOut</span>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Built with care to provide accessible mental health support. Remember that seeking help is a sign of strength, 
            not weakness. You're not alone in this journey.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span>🔒</span>
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🌍</span>
              <span>Multilingual Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🤖</span>
              <span>AI-Powered</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            © 2024 HearMeOut. This tool is for supportive purposes only and does not replace professional medical care.
          </p>
        </div>
      </div>
    </footer>
  );
};