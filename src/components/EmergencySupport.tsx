import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Users, AlertTriangle, Heart, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const CRISIS_HELPLINES = {
  'hi-IN': [
    { name: 'National Suicide Prevention Helpline', phone: '15399', available: '24/7' },
    { name: 'AASRA', phone: '+91-22-27546669', available: '24/7' },
    { name: 'Sneha Foundation', phone: '+91-44-24640050', available: '24/7' },
    { name: 'Fortis Stress Helpline', phone: '+91-8376804102', available: '24/7' }
  ],
  'en-US': [
    { name: '988 Suicide & Crisis Lifeline', phone: '988', available: '24/7' },
    { name: 'Crisis Text Line', phone: 'Text HOME to 741741', available: '24/7' },
    { name: 'National Domestic Violence Hotline', phone: '1-800-799-7233', available: '24/7' }
  ],
  'es-ES': [
    { name: 'Teléfono de la Esperanza', phone: '717003717', available: '24/7' },
    { name: 'Línea de Crisis', phone: '900202010', available: '24/7' }
  ]
};

export const EmergencySupport: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showCrisisMode, setShowCrisisMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('hi-IN');

  useEffect(() => {
    // Load emergency contacts from localStorage
    const saved = localStorage.getItem('emergency-contacts');
    if (saved) {
      setEmergencyContacts(JSON.parse(saved));
    }

    // Get user's language preference
    const lang = localStorage.getItem('voice-language') || 'hi-IN';
    setCurrentLanguage(lang);
  }, []);

  const handleCrisisCall = (phone: string) => {
    // For mobile devices, directly initiate call
    if (phone.includes('Text')) {
      // Handle text-based services
      alert(`Send a text message: ${phone}`);
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  const activateCrisisMode = () => {
    setShowCrisisMode(true);
    // Store crisis activation for analytics/follow-up
    localStorage.setItem('crisis-mode-activated', new Date().toISOString());
  };

  const helplines = CRISIS_HELPLINES[currentLanguage as keyof typeof CRISIS_HELPLINES] || CRISIS_HELPLINES['hi-IN'];

  if (showCrisisMode) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive bg-background">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">Crisis Support</CardTitle>
            <CardDescription>Immediate help is available. You're not alone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-destructive">
              <Heart className="h-4 w-4" />
              <AlertDescription>
                If you're having thoughts of self-harm, please reach out immediately. Your life matters.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Emergency Helplines</h3>
              {helplines.map((helpline, index) => (
                <Button
                  key={index}
                  variant="destructive"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleCrisisCall(helpline.phone)}
                >
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{helpline.name}</div>
                    <div className="text-xs opacity-90">{helpline.phone} • {helpline.available}</div>
                  </div>
                </Button>
              ))}
            </div>

            {emergencyContacts.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Your Emergency Contacts</h3>
                  {emergencyContacts.slice(0, 3).map((contact, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => handleCrisisCall(contact.phone)}
                    >
                      <Users className="h-4 w-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.relationship}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowCrisisMode(false)}
            >
              Return to App
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Emergency Support</h2>
        <p className="text-muted-foreground">Quick access to help when you need it most</p>
      </div>

      <div className="grid gap-4">
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Crisis Support
            </CardTitle>
            <CardDescription>
              If you're experiencing a mental health crisis, immediate help is available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              size="lg"
              className="w-full mb-4"
              onClick={activateCrisisMode}
            >
              <Phone className="h-5 w-5 mr-2" />
              I Need Help Now
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This will give you immediate access to crisis helplines and emergency contacts
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Crisis Helplines
              </CardTitle>
              <CardDescription>24/7 professional support available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {helplines.slice(0, 2).map((helpline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-foreground">{helpline.name}</div>
                    <div className="text-xs text-muted-foreground">{helpline.available}</div>
                  </div>
                  <Badge variant="outline">{helpline.phone}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Resources
              </CardTitle>
              <CardDescription>Local mental health services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium text-sm text-foreground">Community Mental Health Centers</div>
                <div className="text-xs text-muted-foreground">Free and low-cost counseling</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium text-sm text-foreground">Hospital Emergency Rooms</div>
                <div className="text-xs text-muted-foreground">24/7 psychiatric emergency care</div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Find Services Near Me
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personal Emergency Contacts
            </CardTitle>
            <CardDescription>
              Add trusted friends and family for quick access during difficult times
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emergencyContacts.length === 0 ? (
              <div className="text-center py-6">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No emergency contacts added yet</p>
                <Button variant="outline">
                  Add Emergency Contact
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCrisisCall(contact.phone)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add Another Contact
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};