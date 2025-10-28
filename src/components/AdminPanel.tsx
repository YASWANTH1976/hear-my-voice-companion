import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Key, BarChart3, Users } from 'lucide-react';
import { SurveyInsights } from '@/components/SurveyInsights';

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('researcherMode') === 'true';
  });
  const [password, setPassword] = useState('');
  const [showSurveys, setShowSurveys] = useState(false);

  const handleLogin = () => {
    // Simple password check for demo (in production, use proper authentication)
    if (password === 'hearmeout2024') {
      localStorage.setItem('researcherMode', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('researcherMode');
    setIsAuthenticated(false);
    setShowSurveys(false);
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Researcher Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">Access Code</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter researcher access code"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Access Survey Data
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            For researchers and administrators only
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Research Dashboard
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowSurveys(!showSurveys)}
                variant="outline"
                size="sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showSurveys ? 'Hide' : 'Show'} Survey Data
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold">Survey Analytics</div>
              <div className="text-sm text-muted-foreground">Age group insights</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold">Usage Patterns</div>
              <div className="text-sm text-muted-foreground">Feature preferences</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold">Demographics</div>
              <div className="text-sm text-muted-foreground">Age distribution</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSurveys && <SurveyInsights />}
    </div>
  );
};