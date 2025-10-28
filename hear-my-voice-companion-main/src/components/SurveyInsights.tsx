import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Download, Eye, TrendingUp } from 'lucide-react';

interface SurveyData {
  ageGroup: string;
  primaryConcerns: string[];
  preferredFeatures: string[];
  usageFrequency: string;
  helpfulnessRating: number;
  suggestions: string;
  timestamp: Date;
}

interface AgeGroupInsights {
  ageGroup: string;
  totalResponses: number;
  avgHelpfulness: number;
  topConcerns: { concern: string; count: number }[];
  topFeatures: { feature: string; count: number }[];
  commonUsage: string;
  suggestions: string[];
}

export const SurveyInsights: React.FC = () => {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [insights, setInsights] = useState<AgeGroupInsights[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const savedSurveys = JSON.parse(localStorage.getItem('ageGroupSurveys') || '[]');
    setSurveys(savedSurveys);
    generateInsights(savedSurveys);
  }, []);

  const generateInsights = (surveyData: SurveyData[]) => {
    const groupedData = surveyData.reduce((acc, survey) => {
      if (!acc[survey.ageGroup]) {
        acc[survey.ageGroup] = [];
      }
      acc[survey.ageGroup].push(survey);
      return acc;
    }, {} as Record<string, SurveyData[]>);

    const insights: AgeGroupInsights[] = Object.entries(groupedData).map(([ageGroup, data]) => {
      // Calculate average helpfulness
      const avgHelpfulness = data.reduce((sum, s) => sum + s.helpfulnessRating, 0) / data.length;

      // Count concerns
      const concernCounts = data.reduce((acc, s) => {
        s.primaryConcerns.forEach(concern => {
          acc[concern] = (acc[concern] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topConcerns = Object.entries(concernCounts)
        .map(([concern, count]) => ({ concern, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Count features
      const featureCounts = data.reduce((acc, s) => {
        s.preferredFeatures.forEach(feature => {
          acc[feature] = (acc[feature] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topFeatures = Object.entries(featureCounts)
        .map(([feature, count]) => ({ feature, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Most common usage frequency
      const usageCounts = data.reduce((acc, s) => {
        acc[s.usageFrequency] = (acc[s.usageFrequency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonUsage = Object.entries(usageCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

      return {
        ageGroup,
        totalResponses: data.length,
        avgHelpfulness: Math.round(avgHelpfulness * 10) / 10,
        topConcerns,
        topFeatures,
        commonUsage,
        suggestions: data.map(s => s.suggestions).filter(Boolean)
      };
    });

    setInsights(insights.sort((a, b) => b.totalResponses - a.totalResponses));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(surveys, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hearmeout-survey-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (surveys.length === 0) {
    return (
      <Card className="card-hover">
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Survey Data Yet</h3>
          <p className="text-muted-foreground">
            Survey responses will appear here once users start participating.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Survey Analytics Dashboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowInsights(!showInsights)}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showInsights ? 'Hide' : 'Show'} Insights
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{surveys.length}</div>
              <div className="text-sm text-muted-foreground">Total Responses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{insights.length}</div>
              <div className="text-sm text-muted-foreground">Age Groups</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {insights.length > 0 ? (insights.reduce((sum, i) => sum + i.avgHelpfulness, 0) / insights.length).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Helpfulness</div>
            </div>
          </div>

          {showInsights && (
            <div className="space-y-6">
              {insights.map((insight) => (
                <Card key={insight.ageGroup} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Age Group: {insight.ageGroup}</span>
                      <Badge variant="secondary">
                        {insight.totalResponses} responses
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Top Concerns
                        </h4>
                        <div className="space-y-1">
                          {insight.topConcerns.slice(0, 3).map((concern, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{concern.concern}</span>
                              <Badge variant="outline">{concern.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Preferred Features</h4>
                        <div className="space-y-1">
                          {insight.topFeatures.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{feature.feature}</span>
                              <Badge variant="outline">{feature.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Helpfulness Rating: </span>
                        <span className="text-lg font-bold text-primary">{insight.avgHelpfulness}/10</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Common Usage: </span>
                        <Badge>{insight.commonUsage}</Badge>
                      </div>
                    </div>

                    {insight.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recent Suggestions</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {insight.suggestions.slice(0, 3).map((suggestion, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground p-2 bg-muted/20 rounded">
                              "{suggestion}"
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};