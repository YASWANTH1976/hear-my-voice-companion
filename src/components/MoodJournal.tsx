import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  date: Date;
  mood: string;
  content: string;
  tags: string[];
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-800' },
  { emoji: '😔', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
  { emoji: '😰', label: 'Anxious', color: 'bg-yellow-100 text-yellow-800' },
  { emoji: '😠', label: 'Angry', color: 'bg-red-100 text-red-800' },
  { emoji: '😴', label: 'Tired', color: 'bg-gray-100 text-gray-800' },
  { emoji: '😌', label: 'Peaceful', color: 'bg-purple-100 text-purple-800' },
];

export const MoodJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('moodJournal');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedMood, setSelectedMood] = useState('');
  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const { toast } = useToast();

  const saveEntry = () => {
    if (!selectedMood || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a mood and write something.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: selectedMood,
      content: content.trim(),
      tags: extractTags(content)
    };

    const updatedEntries = [newEntry, ...entries.slice(0, 29)]; // Keep last 30 entries
    setEntries(updatedEntries);
    localStorage.setItem('moodJournal', JSON.stringify(updatedEntries));

    setSelectedMood('');
    setContent('');
    setIsWriting(false);
    
    toast({
      title: "Entry Saved",
      description: "Your mood journal entry has been saved privately.",
    });
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('moodJournal', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been removed.",
    });
  };

  const extractTags = (text: string): string[] => {
    const commonWords = ['work', 'family', 'friends', 'health', 'stress', 'love', 'anxiety', 'happiness', 'goals'];
    return commonWords.filter(word => 
      text.toLowerCase().includes(word)
    ).slice(0, 3);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (!isWriting && entries.length === 0) {
    return (
      <Card className="card-hover">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Start Your Mood Journal</CardTitle>
          <CardDescription>
            Track your emotions and thoughts in a private, secure journal that stays on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => setIsWriting(true)}
            className="gradient-primary text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Write First Entry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Writing Interface */}
      {isWriting && (
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              New Journal Entry
            </CardTitle>
            <CardDescription>
              How are you feeling right now? Write about your thoughts and emotions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
              <div className="grid grid-cols-3 gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <Button
                    key={mood.label}
                    variant={selectedMood === mood.label ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col gap-1 ${selectedMood === mood.label ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedMood(mood.label)}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">What's on your mind?</label>
              <Textarea
                placeholder="Write about your day, your feelings, what's bothering you, or what made you happy..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsWriting(false);
                  setSelectedMood('');
                  setContent('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveEntry} className="gradient-primary text-white">
                Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      {entries.length > 0 && (
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Mood Journal</CardTitle>
              <CardDescription>
                Your personal emotional journey ({entries.length} entries)
              </CardDescription>
            </div>
            {!isWriting && (
              <Button 
                onClick={() => setIsWriting(true)}
                size="sm"
                className="gradient-primary text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => {
                const mood = MOOD_OPTIONS.find(m => m.label === entry.mood);
                return (
                  <div key={entry.id} className="border rounded-lg p-4 bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {mood && (
                          <span className="text-lg">{mood.emoji}</span>
                        )}
                        <Badge variant="outline" className={mood?.color}>
                          {entry.mood}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};