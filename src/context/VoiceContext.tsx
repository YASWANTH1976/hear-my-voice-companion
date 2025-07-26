import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

// TypeScript declarations for Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

// Language configurations with native scripts
export const SUPPORTED_LANGUAGES = {
  'en-IN': { name: 'English', nativeName: 'English', flag: '🇮🇳' },
  'hi-IN': { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  'te-IN': { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  'ta-IN': { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  'kn-IN': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  'ml-IN': { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  'bn-IN': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  'gu-IN': { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  'mr-IN': { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  'pa-IN': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
};

// Emotion types with intensity levels
export interface Emotion {
  type: 'anxiety' | 'sadness' | 'anger' | 'stress' | 'happiness' | 'confusion';
  intensity: 'low' | 'medium' | 'high';
  confidence: number;
  topics: string[];
}

// AI Response types
export interface AIResponse {
  text: string;
  emotion: Emotion;
  timestamp: Date;
  audioBlob?: Blob;
}

// Context interface
interface VoiceContextType {
  // Language state
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  
  // Voice recording state
  isRecording: boolean;
  isListening: boolean;
  transcript: string;
  audioLevel: number;
  
  // Emotion analysis
  currentEmotion: Emotion | null;
  
  // AI responses
  aiResponse: AIResponse | null;
  responseHistory: AIResponse[];
  
  // Voice controls
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
  
  // AI interaction
  generateAIResponse: (transcript: string) => Promise<void>;
  speakResponse: (text: string) => void;
  
  // Wellness strategies
  currentStrategy: string | null;
  setCurrentStrategy: (strategy: string | null) => void;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [responseHistory, setResponseHistory] = useState<AIResponse[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Clear error handler
  const clearError = useCallback(() => setError(null), []);

  // Language change handler
  const handleLanguageChange = useCallback((lang: string) => {
    setSelectedLanguage(lang);
    setTranscript('');
    setCurrentEmotion(null);
    setAiResponse(null);
    setResponseHistory([]);
    clearError();
  }, [clearError]);

  // Advanced emotion analysis with context awareness
  const analyzeEmotion = useCallback((text: string): Emotion => {
    const lowerText = text.toLowerCase();
    
    // Define emotion patterns with context
    const emotionPatterns = {
      anxiety: {
        keywords: ['anxious', 'worried', 'nervous', 'panic', 'afraid', 'fear', 'scared', 'tense'],
        contexts: ['exam', 'interview', 'presentation', 'meeting', 'future', 'uncertainty'],
        intensity: { high: ['panic', 'terrified'], medium: ['worried', 'nervous'], low: ['concerned', 'uneasy'] }
      },
      sadness: {
        keywords: ['sad', 'depressed', 'down', 'low', 'blue', 'crying', 'tears', 'grief'],
        contexts: ['loss', 'breakup', 'death', 'failure', 'rejection', 'alone', 'lonely'],
        intensity: { high: ['devastated', 'heartbroken'], medium: ['sad', 'down'], low: ['blue', 'melancholy'] }
      },
      anger: {
        keywords: ['angry', 'mad', 'furious', 'rage', 'hate', 'frustrated', 'irritated', 'annoyed'],
        contexts: ['unfair', 'betrayal', 'injustice', 'disrespect', 'conflict'],
        intensity: { high: ['furious', 'rage'], medium: ['angry', 'mad'], low: ['annoyed', 'irritated'] }
      },
      stress: {
        keywords: ['stressed', 'overwhelmed', 'pressure', 'burden', 'exhausted', 'tired', 'overworked'],
        contexts: ['work', 'job', 'deadline', 'money', 'financial', 'bills', 'health'],
        intensity: { high: ['overwhelmed', 'breaking'], medium: ['stressed', 'pressure'], low: ['tired', 'busy'] }
      },
      happiness: {
        keywords: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good'],
        contexts: ['success', 'achievement', 'celebration', 'love', 'friendship'],
        intensity: { high: ['ecstatic', 'overjoyed'], medium: ['happy', 'excited'], low: ['good', 'pleasant'] }
      },
      confusion: {
        keywords: ['confused', 'lost', 'unclear', 'uncertain', 'puzzled', 'bewildered'],
        contexts: ['decision', 'choice', 'direction', 'meaning', 'purpose'],
        intensity: { high: ['bewildered', 'lost'], medium: ['confused', 'uncertain'], low: ['unclear', 'puzzled'] }
      }
    };

    // Detect topics mentioned
    const topicPatterns = {
      work: ['work', 'job', 'career', 'boss', 'colleague', 'office', 'project', 'deadline'],
      relationship: ['relationship', 'partner', 'boyfriend', 'girlfriend', 'marriage', 'family', 'friend'],
      health: ['health', 'sick', 'illness', 'doctor', 'hospital', 'pain', 'medical'],
      financial: ['money', 'financial', 'bills', 'debt', 'expensive', 'cost', 'budget'],
      academic: ['study', 'exam', 'school', 'college', 'university', 'grade', 'education'],
      future: ['future', 'tomorrow', 'next', 'plan', 'goal', 'uncertain', 'unknown']
    };

    let detectedEmotion: keyof typeof emotionPatterns = 'happiness';
    let maxScore = 0;
    let intensity: 'low' | 'medium' | 'high' = 'low';
    let confidence = 0;
    let topics: string[] = [];

    // Analyze emotions
    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      let score = 0;
      
      // Check keywords
      patterns.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += 2;
          
          // Check intensity
          if (patterns.intensity.high.includes(keyword)) intensity = 'high';
          else if (patterns.intensity.medium.includes(keyword)) intensity = 'medium';
          else intensity = 'low';
        }
      });
      
      // Check contexts
      patterns.contexts.forEach(context => {
        if (lowerText.includes(context)) {
          score += 1;
        }
      });
      
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as keyof typeof emotionPatterns;
        confidence = Math.min(score / 5, 1);
      }
    });

    // Detect topics
    Object.entries(topicPatterns).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        topics.push(topic);
      }
    });

    return {
      type: detectedEmotion,
      intensity,
      confidence,
      topics
    };
  }, []);

  // Generate contextual AI responses
  const generateAIResponse = useCallback(async (text: string) => {
    if (!text.trim()) return;

    try {
      const emotion = analyzeEmotion(text);
      setCurrentEmotion(emotion);

      // Generate contextual response based on emotion, topics, and actual words
      const response = generateContextualResponse(text, emotion);
      
      const aiResp: AIResponse = {
        text: response,
        emotion,
        timestamp: new Date()
      };

      setAiResponse(aiResp);
      setResponseHistory(prev => [aiResp, ...prev.slice(0, 9)]); // Keep last 10

      // Speak the response
      speakResponse(response);
    } catch (err) {
      setError('Failed to generate AI response');
    }
  }, [analyzeEmotion]);

  // Generate contextual responses
  const generateContextualResponse = (text: string, emotion: Emotion): string => {
    const lowerText = text.toLowerCase();
    
    // Specific response patterns based on emotion and context
    const responseTemplates = {
      anxiety: {
        work: [
          "Work anxiety can be really overwhelming. What specific aspect of your work is causing you the most stress right now?",
          "I understand how work pressures can create anxiety. Would you like to talk about what's happening at work, or try a breathing exercise to help calm your mind?",
          "Workplace anxiety is very common. It sounds like you're dealing with a lot. What would help you feel more in control of the situation?"
        ],
        general: [
          "I can hear the anxiety in what you're sharing. It's completely normal to feel this way, and you're not alone in this.",
          "Anxiety can feel so consuming. What you're experiencing is valid. Would you like to explore what's triggering these feelings?",
          "Thank you for sharing something so personal. When anxiety hits, it can feel overwhelming. What usually helps you feel a bit more grounded?"
        ]
      },
      sadness: {
        relationship: [
          "Relationship pain can feel so deep and isolating. It's okay to feel sad about this - your feelings are completely valid.",
          "I'm sorry you're going through this relationship difficulty. Sadness after relationship struggles is natural. How are you taking care of yourself right now?",
          "It takes courage to share when you're feeling down about relationships. What aspect of this situation is weighing on you most?"
        ],
        general: [
          "I can sense the sadness in your words. It's okay to sit with these feelings - they're telling you something important.",
          "Sadness can feel so heavy sometimes. Thank you for trusting me with how you're feeling. What's been the hardest part of your day?",
          "Your sadness is valid and deserves attention. Sometimes talking about it can help lighten the load a little."
        ]
      },
      happiness: {
        achievement: [
          "I can hear the joy in your voice! It's wonderful when things go well. What made this moment special for you?",
          "Your happiness is contagious! I love hearing about good things happening. Tell me more about what's bringing you joy.",
          "It's so nice to hear you sounding happy! Success and good moments deserve to be celebrated. What are you most proud of?"
        ],
        general: [
          "Your positive energy is lovely to experience! What's been the highlight of your day?",
          "I'm so glad you're feeling good! Happiness is precious. What's contributing to this good mood?",
          "It's wonderful to hear you in such good spirits! What's been bringing you joy lately?"
        ]
      },
      stress: {
        work: [
          "Work stress can be so draining. It sounds like you're carrying a heavy load right now. What's the biggest source of pressure?",
          "I hear how stressed you are about work. That level of stress isn't sustainable. What support do you need right now?",
          "Work-related stress affects so many people. You're not alone in feeling overwhelmed. What would help you feel more balanced?"
        ],
        financial: [
          "Financial stress can create such anxiety about the future. It's understandable that you're feeling overwhelmed by money concerns.",
          "Money worries can keep us up at night and affect everything else. What aspect of your financial situation is most stressful?",
          "Financial pressure is one of the most common stressors. Your concerns are valid. How has this been affecting your daily life?"
        ],
        general: [
          "Stress can make everything feel more difficult. It sounds like you're managing a lot right now. What's feeling most overwhelming?",
          "I can hear how much pressure you're under. Stress affects us physically and emotionally. What would help you feel some relief?",
          "Being stressed is exhausting. Thank you for sharing what you're going through. What usually helps you decompress?"
        ]
      },
      anger: {
        injustice: [
          "Your anger about this situation makes complete sense. When things feel unfair, anger is a natural response.",
          "I can understand why you'd feel angry about this. Sometimes anger tells us that boundaries have been crossed or values violated.",
          "It sounds like something really unfair happened. Anger can be a healthy response to injustice. What would help you process these feelings?"
        ],
        general: [
          "Anger is telling you something important. It's okay to feel this way. What triggered these feelings?",
          "I hear the frustration and anger in what you're sharing. These feelings are valid. What's been building up for you?",
          "Anger can be so intense. Thank you for expressing it rather than keeping it bottled up. What's behind these feelings?"
        ]
      },
      confusion: {
        decision: [
          "Making decisions when you're feeling unclear can be really challenging. What options are you trying to choose between?",
          "Confusion about big decisions is so normal. Sometimes we need to sit with uncertainty before clarity comes. What's the decision you're facing?",
          "Decision-making can feel overwhelming when there's no clear right answer. What factors are you considering?"
        ],
        general: [
          "Feeling confused or uncertain is part of being human. It's okay not to have all the answers right now.",
          "Confusion can be uncomfortable, but it's often a sign that you're growing or facing something new. What's feeling unclear?",
          "It's okay to feel lost sometimes. Confusion often comes before clarity. What's been on your mind?"
        ]
      }
    };

    // Find the most relevant response
    let selectedResponses = responseTemplates[emotion.type]?.general || responseTemplates.happiness.general;
    
    // Check for specific topics
    for (const topic of emotion.topics) {
      if (responseTemplates[emotion.type]?.[topic as keyof typeof responseTemplates[typeof emotion.type]]) {
        selectedResponses = responseTemplates[emotion.type][topic as keyof typeof responseTemplates[typeof emotion.type]] as string[];
        break;
      }
    }

    // Add intensity modifiers
    let response = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
    
    if (emotion.intensity === 'high') {
      response += " This sounds particularly intense for you right now.";
    } else if (emotion.intensity === 'low') {
      response += " Even small feelings deserve attention and care.";
    }

    return response;
  };

  // Speech synthesis with language support
  const speakResponse = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any current speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
    }
  }, [selectedLanguage]);

  // Audio level monitoring
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255);

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  }, [isRecording]);

  // Start recording with proper setup
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Check for speech recognition support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }

      // Set up audio context for level monitoring
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Set up speech recognition
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
        setIsListening(true);
        monitorAudioLevel();
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          generateAIResponse(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsListening(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
      setIsListening(false);
    }
  }, [selectedLanguage, generateAIResponse, monitorAudioLevel]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRecording(false);
    setIsListening(false);
    setAudioLevel(0);
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setCurrentEmotion(null);
    setAiResponse(null);
  }, []);

  const value: VoiceContextType = {
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    isRecording,
    isListening,
    transcript,
    audioLevel,
    currentEmotion,
    aiResponse,
    responseHistory,
    startRecording,
    stopRecording,
    clearTranscript,
    generateAIResponse,
    speakResponse,
    currentStrategy,
    setCurrentStrategy,
    error,
    clearError
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};