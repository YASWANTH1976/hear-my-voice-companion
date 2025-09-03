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
  'en-US': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  'es-ES': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'fr-FR': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'de-DE': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  'it-IT': { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  'pt-PT': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  'ja-JP': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  'ko-KR': { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  'zh-CN': { name: 'Chinese (Simplified)', nativeName: '中文 (简体)', flag: '🇨🇳' },
  'zh-TW': { name: 'Chinese (Traditional)', nativeName: '中文 (繁體)', flag: '🇹🇼' },
  'hi-IN': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'ar-SA': { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  'ru-RU': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  'nl-NL': { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  'sv-SE': { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  'da-DK': { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  'no-NO': { name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  'fi-FI': { name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  'pl-PL': { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  'tr-TR': { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  'th-TH': { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  'vi-VN': { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  'id-ID': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  'ms-MY': { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  'he-IL': { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  'cs-CZ': { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  'sk-SK': { name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  'hu-HU': { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  'ro-RO': { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  'bg-BG': { name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  'hr-HR': { name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  'sl-SI': { name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  'et-EE': { name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  'lv-LV': { name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  'lt-LT': { name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  'el-GR': { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  'uk-UA': { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  'fa-IR': { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  'ur-PK': { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  'bn-BD': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  'ta-IN': { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  'te-IN': { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  'mr-IN': { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  'gu-IN': { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  'kn-IN': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  'ml-IN': { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  'pa-IN': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  'sw-KE': { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  'af-ZA': { name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
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
  conversationContext: string[];
  
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
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [responseHistory, setResponseHistory] = useState<AIResponse[]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
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
    setConversationContext([]);
    clearError();
  }, [clearError]);

  // Advanced emotion analysis with comprehensive word detection
  const analyzeEmotion = useCallback((text: string): Emotion => {
    const lowerText = text.toLowerCase().trim();
    
    // Enhanced emotion patterns with comprehensive word detection
    const emotionPatterns = {
      happiness: {
        keywords: [
          // Basic positive words
          'happy', 'joy', 'joyful', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'awesome', 'brilliant',
          'good', 'fine', 'okay', 'well', 'excellent', 'perfect', 'beautiful', 'lovely', 'nice', 'pleasant',
          'cheerful', 'delighted', 'thrilled', 'elated', 'euphoric', 'ecstatic', 'overjoyed', 'blissful',
          'content', 'satisfied', 'pleased', 'glad', 'grateful', 'thankful', 'blessed', 'lucky', 'fortunate',
          'positive', 'optimistic', 'hopeful', 'confident', 'energetic', 'vibrant', 'lively', 'upbeat',
          // Success/achievement
          'success', 'win', 'won', 'achieve', 'accomplished', 'proud', 'celebration', 'celebrate',
          'victory', 'triumph', 'milestone', 'breakthrough', 'progress', 'improvement', 'better'
        ],
        phrases: [
          'feeling good', 'doing well', 'going great', 'so happy', 'really good', 'much better',
          'love it', 'love this', 'best day', 'feeling amazing', 'on top of the world'
        ],
        intensity: { 
          high: ['ecstatic', 'overjoyed', 'thrilled', 'euphoric', 'amazing', 'fantastic', 'brilliant'], 
          medium: ['happy', 'excited', 'great', 'wonderful', 'delighted'], 
          low: ['good', 'fine', 'okay', 'pleasant', 'nice'] 
        }
      },
      sadness: {
        keywords: [
          // Basic sad words
          'sad', 'depressed', 'down', 'low', 'blue', 'unhappy', 'miserable', 'upset', 'hurt', 'pain', 'ache',
          'crying', 'tears', 'weep', 'sob', 'grief', 'sorrow', 'mourning', 'heartbroken', 'devastated',
          'lonely', 'alone', 'isolated', 'empty', 'hollow', 'broken', 'shattered', 'crushed', 'destroyed',
          'hopeless', 'helpless', 'worthless', 'useless', 'failure', 'lost', 'defeated', 'disappointed',
          'regret', 'remorse', 'guilt', 'shame', 'despair', 'melancholy', 'gloomy', 'dark', 'heavy',
          // Negative states
          'terrible', 'awful', 'horrible', 'bad', 'worse', 'worst', 'sick', 'ill', 'unwell'
        ],
        phrases: [
          'not good', 'not well', 'not okay', 'not fine', 'not great', 'not happy', 'not doing well',
          'feeling bad', 'feeling down', 'feeling low', 'feeling sad', 'could be better', 'having a hard time',
          'going through', 'struggling with', 'dealing with', 'can\'t handle', 'too much', 'give up'
        ],
        intensity: { 
          high: ['devastated', 'heartbroken', 'crushed', 'destroyed', 'hopeless', 'despair'], 
          medium: ['sad', 'depressed', 'upset', 'hurt', 'lonely'], 
          low: ['down', 'blue', 'disappointed', 'not good'] 
        }
      },
      anxiety: {
        keywords: [
          'anxious', 'worried', 'nervous', 'panic', 'afraid', 'fear', 'scared', 'terrified', 'frightened',
          'tense', 'uneasy', 'restless', 'jittery', 'edgy', 'stressed', 'overwhelmed', 'pressure',
          'concern', 'concerned', 'trouble', 'troubled', 'disturbed', 'unsettled', 'agitated',
          'paranoid', 'suspicious', 'insecure', 'uncertain', 'doubt', 'doubtful', 'questioning'
        ],
        phrases: [
          'freaking out', 'losing it', 'can\'t breathe', 'heart racing', 'sweating', 'shaking',
          'what if', 'worried about', 'scared of', 'afraid of', 'nervous about'
        ],
        intensity: { 
          high: ['panic', 'terrified', 'freaking out', 'losing it'], 
          medium: ['anxious', 'worried', 'nervous', 'scared'], 
          low: ['concerned', 'uneasy', 'uncertain'] 
        }
      },
      anger: {
        keywords: [
          'angry', 'mad', 'furious', 'rage', 'hate', 'frustrated', 'irritated', 'annoyed', 'pissed',
          'outraged', 'livid', 'fuming', 'enraged', 'irate', 'aggravated', 'exasperated', 'fed up',
          'disgusted', 'revolted', 'appalled', 'offended', 'insulted', 'betrayed', 'cheated',
          'unfair', 'unjust', 'wrong', 'stupid', 'ridiculous', 'absurd', 'crazy', 'insane'
        ],
        phrases: [
          'pissed off', 'fed up', 'had enough', 'sick of', 'tired of', 'can\'t stand', 'drives me crazy',
          'makes me mad', 'so angry', 'really mad', 'absolutely furious'
        ],
        intensity: { 
          high: ['furious', 'rage', 'livid', 'enraged', 'absolutely furious'], 
          medium: ['angry', 'mad', 'frustrated', 'pissed'], 
          low: ['annoyed', 'irritated', 'fed up'] 
        }
      },
      stress: {
        keywords: [
          'stressed', 'stress', 'overwhelmed', 'pressure', 'burden', 'exhausted', 'tired', 'drained',
          'overworked', 'swamped', 'buried', 'drowning', 'suffocating', 'breaking', 'snapping',
          'deadline', 'rush', 'hurry', 'urgent', 'crisis', 'emergency', 'chaos', 'mess',
          'juggling', 'balancing', 'managing', 'handling', 'coping', 'struggling'
        ],
        phrases: [
          'too much', 'can\'t handle', 'breaking point', 'about to snap', 'losing control',
          'so much pressure', 'under stress', 'stressed out', 'burned out', 'worn out'
        ],
        intensity: { 
          high: ['overwhelmed', 'breaking', 'drowning', 'about to snap'], 
          medium: ['stressed', 'pressure', 'exhausted', 'swamped'], 
          low: ['tired', 'busy', 'juggling'] 
        }
      },
      confusion: {
        keywords: [
          'confused', 'lost', 'unclear', 'uncertain', 'puzzled', 'bewildered', 'perplexed', 'baffled',
          'don\'t understand', 'don\'t know', 'unsure', 'indecisive', 'torn', 'conflicted',
          'mixed up', 'muddled', 'foggy', 'blank', 'stuck', 'blocked', 'stumped'
        ],
        phrases: [
          'don\'t know what', 'not sure', 'can\'t decide', 'don\'t understand', 'makes no sense',
          'so confused', 'totally lost', 'have no idea', 'what should i', 'what do you think'
        ],
        intensity: { 
          high: ['bewildered', 'totally lost', 'have no idea'], 
          medium: ['confused', 'uncertain', 'puzzled'], 
          low: ['unsure', 'unclear', 'not sure'] 
        }
      }
    };

    // Check for negation patterns that flip emotions
    const negationWords = ['not', 'don\'t', 'doesn\'t', 'can\'t', 'won\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'couldn\'t', 'wouldn\'t', 'shouldn\'t', 'mustn\'t', 'no', 'never', 'nothing', 'nobody', 'none'];
    
    // Check for explicit negative phrases first
    const negativeStates = [
      'not good', 'not well', 'not okay', 'not fine', 'not great', 'not happy', 'not doing well',
      'feeling bad', 'feeling down', 'feeling terrible', 'could be better', 'having a hard time',
      'not so good', 'not really', 'not particularly', 'struggling', 'going through'
    ];

    const hasNegativeState = negativeStates.some(phrase => lowerText.includes(phrase));
    if (hasNegativeState) {
      return { type: 'sadness', intensity: 'medium', confidence: 0.85, topics: [] };
    }

    // Detect topics
    const topicPatterns = {
      work: ['work', 'job', 'career', 'boss', 'colleague', 'office', 'project', 'deadline', 'meeting', 'presentation', 'salary', 'promotion', 'company', 'business', 'professional', 'workplace', 'employee', 'manager'],
      relationship: ['relationship', 'partner', 'boyfriend', 'girlfriend', 'husband', 'wife', 'marriage', 'family', 'friend', 'love', 'dating', 'romance', 'breakup', 'divorce', 'parents', 'children', 'kids'],
      health: ['health', 'sick', 'illness', 'doctor', 'hospital', 'pain', 'medical', 'medicine', 'treatment', 'disease', 'injury', 'physical', 'mental health', 'therapy', 'counseling'],
      financial: ['money', 'financial', 'bills', 'debt', 'expensive', 'cost', 'budget', 'income', 'salary', 'poor', 'rich', 'bank', 'loan', 'mortgage', 'rent', 'payment'],
      academic: ['study', 'exam', 'school', 'college', 'university', 'grade', 'education', 'student', 'teacher', 'class', 'homework', 'assignment', 'test', 'degree', 'learning'],
      future: ['future', 'tomorrow', 'next', 'plan', 'goal', 'dream', 'hope', 'wish', 'want', 'will', 'going to', 'expecting', 'anticipating']
    };

    let detectedEmotion: keyof typeof emotionPatterns = 'happiness';
    let maxScore = 0;
    let intensity: 'low' | 'medium' | 'high' = 'low';
    let confidence = 0;
    let topics: string[] = [];

    // Score each emotion
    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      let score = 0;
      
      // Check keywords (higher weight)
      patterns.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += 3;
          
          // Determine intensity
          if (patterns.intensity.high.includes(keyword)) intensity = 'high';
          else if (patterns.intensity.medium.includes(keyword)) intensity = 'medium';
          else intensity = 'low';
        }
      });
      
      // Check phrases (highest weight)
      if (patterns.phrases) {
        patterns.phrases.forEach(phrase => {
          if (lowerText.includes(phrase)) {
            score += 4;
            intensity = 'medium';
          }
        });
      }
      
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as keyof typeof emotionPatterns;
        confidence = Math.min(score / 8, 1);
      }
    });

    // Detect topics mentioned
    Object.entries(topicPatterns).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        topics.push(topic);
      }
    });

    // If no strong emotion detected but we have words, default to neutral happiness
    if (maxScore === 0 && lowerText.length > 0) {
      return {
        type: 'happiness',
        intensity: 'low',
        confidence: 0.3,
        topics
      };
    }

    return {
      type: detectedEmotion,
      intensity,
      confidence,
      topics
    };
  }, []);

  // Generate contextual AI responses with conversation memory
  const generateAIResponse = useCallback(async (text: string) => {
    if (!text.trim()) return;

    try {
      const emotion = analyzeEmotion(text);
      setCurrentEmotion(emotion);

      // Generate contextual response based on emotion, topics, conversation history, and actual words
      const response = generateContextualResponse(text, emotion, conversationContext);
      
      const aiResp: AIResponse = {
        text: response,
        emotion,
        timestamp: new Date()
      };

      setAiResponse(aiResp);
      setResponseHistory(prev => [aiResp, ...prev.slice(0, 9)]); // Keep last 10

      // Add to conversation context AFTER generating response
      setConversationContext(prev => [...prev.slice(-4), text]); // Keep last 5 exchanges

      // Speak the response
      speakResponse(response);
    } catch (err) {
      setError('Failed to generate AI response');
    }
  }, [analyzeEmotion, conversationContext]);

  // Generate contextual responses with conversation awareness
  const generateContextualResponse = (text: string, emotion: Emotion, context: string[] = []): string => {
    const lowerText = text.toLowerCase().trim();
    
    // Check if this is a follow-up response to a previous question
    const lastContext = context[context.length - 1] || '';
    const isFollowUp = context.length > 1 && ( // Changed from > 0 to > 1
      lowerText.includes('because') || 
      lowerText.includes('since') ||
      lowerText.includes('well') ||
      lowerText.includes('actually') ||
      lowerText.includes('you know') ||
      lowerText.includes('yeah') ||
      lowerText.includes('yes') ||
      lowerText.includes('no') ||
      (lowerText.length < 30 && !lowerText.includes('hello') && !lowerText.includes('hi')) // Short responses but not greetings
    );

    // Direct conversational patterns
    const conversationPatterns = [
      // Greetings
      {
        patterns: ['hello', 'hi ', 'hey ', 'good morning', 'good afternoon', 'good evening'],
        responses: [
          "Hello! It's wonderful to hear from you. I'm here to listen and support you in whatever way I can. How are you feeling today?",
          "Hi there! I'm so glad you're here. I'm ready to listen to whatever you'd like to share. What's on your mind?",
          "Hey! Thanks for reaching out. I'm here to provide a safe space for you to express yourself. How has your day been?"
        ]
      },
      
      // How are you
      {
        patterns: ['how are you', 'how do you feel', 'what about you'],
        responses: [
          "Thank you for asking! I'm here and fully present, ready to focus entirely on you and how you're feeling. What would you like to talk about?",
          "I appreciate you asking! I'm doing well and I'm here to listen. More importantly, how are YOU doing today?",
          "That's so kind of you to ask! I'm good and ready to support you. I'd love to hear about how you're feeling right now."
        ]
      },
      
      // Positive states
      {
        patterns: ['i am good', 'i\'m good', 'im good', 'i am fine', 'i\'m fine', 'im fine', 'i am okay', 'i\'m okay', 'im okay', 'doing well', 'feeling good', 'i am great', 'i\'m great'],
        responses: [
          "That's absolutely wonderful to hear! I'm so happy you're feeling good. What's been contributing to this positive feeling?",
          "I love hearing that! It's beautiful when things are going well. What's been the highlight of your day or week?",
          "That brings me joy to hear! When we feel good, it's worth celebrating. What specific things have been going right for you?"
        ]
      },
      
      // Negative states
      {
        patterns: ['not good', 'not well', 'not okay', 'not fine', 'not great', 'not doing well', 'feeling bad', 'feeling down', 'could be better', 'having a hard time', 'struggling'],
        responses: [
          "I'm really sorry to hear you're going through a difficult time. That takes courage to share. What's been weighing most heavily on your mind?",
          "Thank you for being honest about how you're feeling. It's completely okay to not be okay. Would you like to tell me more about what's been challenging?",
          "I hear you, and I want you to know that your feelings are completely valid. Sometimes life can be really tough. What's been the hardest part for you lately?"
        ]
      },
      
      // Thanks
      {
        patterns: ['thank you', 'thanks', 'appreciate', 'grateful'],
        responses: [
          "You're so very welcome! I'm genuinely glad I could help in some way. Is there anything else you'd like to explore or talk about?",
          "It means a lot to hear that! I'm here whenever you need someone to listen. What else is on your mind?",
          "I'm touched that you found our conversation helpful! That's exactly why I'm here. How else can I support you today?"
        ]
      },
      
      // Questions about AI
      {
        patterns: ['what are you', 'who are you', 'are you real', 'are you human'],
        responses: [
          "I'm an AI companion designed to provide emotional support and be a good listener. While I'm not human, I'm here to offer genuine care and understanding. What matters most is that you feel heard and supported.",
          "I'm an AI created to help people process their emotions and thoughts. I may not be human, but I'm programmed with empathy and genuine concern for your wellbeing. How can I best support you today?",
          "I'm an artificial intelligence, but my purpose is very real - to provide you with a safe, judgment-free space to express yourself. What would you like to talk about?"
        ]
      }
    ];

    // Check conversation patterns first
    for (const pattern of conversationPatterns) {
      if (pattern.patterns.some(p => lowerText.includes(p))) {
        return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
      }
    }

    // Handle follow-up responses
    if (isFollowUp && context.length > 0) {
      const followUpResponses = [
        `I really appreciate you sharing that with me. ${generateEmotionalResponse(text, emotion)}`,
        `Thank you for opening up about that. ${generateEmotionalResponse(text, emotion)}`,
        `That gives me a much clearer picture. ${generateEmotionalResponse(text, emotion)}`,
        `I'm glad you felt comfortable sharing more. ${generateEmotionalResponse(text, emotion)}`
      ];
      return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
    }

    // Generate emotion-based response
    return generateEmotionalResponse(text, emotion);
  };

  // Generate emotion-specific responses
  const generateEmotionalResponse = (text: string, emotion: Emotion): string => {
    
    const lowerText = text.toLowerCase();
    
    // Emotion-specific response templates with topic awareness
    const responseTemplates = {
      happiness: {
        work: [
          "It's fantastic to hear positive things about your work! Success at work can be so fulfilling. What specifically has been going well?",
          "Work satisfaction is such a wonderful feeling! I love hearing when things are clicking professionally. What's been the best part?",
          "That's amazing! When work is going well, it can boost our whole mood. What achievement or moment made you feel this way?"
        ],
        relationship: [
          "Relationship happiness is so beautiful to witness! Love and connection bring such joy. What's been special about your relationships lately?",
          "I can hear the warmth in your voice when you talk about this! Healthy relationships are such a blessing. What made this moment meaningful?",
          "It's wonderful when our relationships bring us joy! Tell me more about what's been going well with the people you care about."
        ],
        general: [
          "Your happiness radiates through your words! It's beautiful to hear someone feeling genuinely good. What's been bringing you the most joy?",
          "I love the positive energy I'm hearing! When we feel good, it's worth celebrating and understanding. What's contributed to this wonderful mood?",
          "It's such a gift to hear genuine happiness! These moments are precious. What would you say has been the source of these good feelings?"
        ]
      },
      
      sadness: {
        work: [
          "Work difficulties can really weigh on us emotionally. It's completely understandable to feel down when professional life is challenging. What's been the hardest part about work lately?",
          "Job struggles can affect so much more than just our career - they impact our whole sense of wellbeing. I'm sorry you're going through this. What support would be most helpful?",
          "When work isn't going well, it can feel like everything else suffers too. Your feelings about this are completely valid. What aspect of work has been most disappointing or difficult?"
        ],
        relationship: [
          "Relationship pain cuts so deep because these connections mean so much to us. I'm sorry you're hurting. What's been the most challenging part of this situation?",
          "When relationships struggle, it can affect everything else in our lives. Your sadness about this is completely natural and valid. How has this been impacting you?",
          "I can hear how much this relationship situation means to you, which makes the pain even more real. What would help you process these difficult feelings?"
        ],
        health: [
          "Health concerns can be so scary and overwhelming. It's natural to feel sad or worried when our bodies aren't cooperating. What's been the most concerning part for you?",
          "Dealing with health issues brings up so many emotions - fear, sadness, frustration. Your feelings are completely understandable. How are you coping with everything?",
          "When our health is affected, it impacts every aspect of our lives. I'm sorry you're going through this. What kind of support would be most helpful right now?"
        ],
        general: [
          "I can really hear the sadness in your voice, and I want you to know that these feelings are completely valid. Sometimes we need to sit with sadness to understand what it's telling us. What's been weighing most heavily on your heart?",
          "Sadness can feel so isolating, but you're not alone in this. Thank you for trusting me with these difficult feelings. What's been the hardest part of what you're going through?",
          "Your sadness matters, and it deserves attention and care. Sometimes talking through these feelings can help us understand them better. What do you think is at the core of these emotions?"
        ]
      },
      
      anxiety: {
        work: [
          "Work anxiety is incredibly common, especially with deadlines, presentations, or difficult colleagues. What specific aspect of your job is triggering the most anxiety right now?",
          "Professional anxiety can be so consuming because work takes up such a big part of our lives. I understand how overwhelming this must feel. What would help you feel more in control?",
          "Workplace stress and anxiety can affect our sleep, relationships, and overall wellbeing. You're not alone in feeling this way. What's been the biggest source of worry at work?"
        ],
        future: [
          "Uncertainty about the future can create such persistent anxiety. Not knowing what's coming next is genuinely difficult for most people. What aspects of the future worry you most?",
          "Future anxiety is so relatable - we want to feel prepared and secure, but life is inherently uncertain. What specific unknowns are keeping you up at night?",
          "When we can't predict or control what's ahead, anxiety naturally kicks in. It's our mind's way of trying to prepare for every scenario. What future scenarios concern you most?"
        ],
        general: [
          "Anxiety can make everything feel urgent and overwhelming, even small things. Your feelings are completely valid - anxiety is real and affects millions of people. What tends to trigger these anxious feelings for you?",
          "I can hear the worry in your voice, and I want you to know that anxiety is nothing to be ashamed of. It's your mind trying to protect you, even when there's no immediate danger. What helps you feel most grounded when anxiety hits?",
          "Anxiety can make our minds race with 'what if' scenarios. It's exhausting to live with that constant worry. What physical or emotional symptoms have you been noticing?"
        ]
      },
      
      anger: {
        work: [
          "Workplace frustration can build up so quickly, especially when we feel unheard or treated unfairly. What happened at work that triggered these angry feelings?",
          "Work anger often comes from feeling powerless or disrespected in professional situations. I can understand why you'd feel this way. What would help you feel more empowered in this situation?",
          "When work environments become toxic or unreasonable, anger is a completely natural response. What boundaries need to be set or what changes need to happen?"
        ],
        relationship: [
          "Relationship conflicts can trigger such intense anger because these people matter so much to us. What happened that made you feel this way?",
          "When someone we care about hurts or disappoints us, anger often masks deeper feelings of hurt or betrayal. What did this person do that crossed a line for you?",
          "Relationship anger usually signals that an important boundary was crossed or a core value was violated. What do you need from this person or this situation?"
        ],
        general: [
          "Anger is often our emotion that says 'this isn't right' or 'this isn't fair.' Your anger is telling you something important. What injustice or frustration triggered these feelings?",
          "I can hear the intensity of your anger, and I want you to know that this emotion is valid. Anger often protects other vulnerable feelings underneath. What do you think your anger is trying to tell you?",
          "Sometimes anger gives us the energy we need to make important changes or stand up for ourselves. What situation or person has pushed you to this point?"
        ]
      },
      
      stress: {
        work: [
          "Work stress can feel like drowning sometimes - too many deadlines, too many responsibilities, not enough time. What's been piling up that's making you feel most overwhelmed?",
          "Professional stress affects our sleep, relationships, and physical health. It sounds like you're carrying a really heavy load right now. What would help you feel more balanced?",
          "When work stress becomes chronic, it can feel like we're always 'on' and never able to truly relax. What aspects of your job are creating the most pressure?"
        ],
        financial: [
          "Financial stress hits at such a basic level of security - it affects how safe we feel about our future. Money worries can keep us up at night. What financial pressures are weighing on you most?",
          "When money is tight, it seems like every decision becomes stressful because financial concerns touch everything. How has this financial stress been affecting your daily life and wellbeing?",
          "Financial pressure can make us feel trapped or like we're failing, even when circumstances are often beyond our control. What would help you feel more financially secure or stable?"
        ],
        general: [
          "Stress can make everything feel more difficult and overwhelming than it normally would. It sounds like you're juggling a lot right now. What feels like the most urgent or pressing stressor?",
          "When we're stressed, our minds can't rest and our bodies stay tense. It's exhausting to live in that state. What usually helps you decompress when stress builds up like this?",
          "Chronic stress affects every part of our lives - our patience, our relationships, our physical health. What kind of relief or support would be most helpful right now?"
        ]
      },
      
      confusion: {
        decision: [
          "Big decisions can feel paralyzing when we can't see a clear 'right' answer. What decision are you trying to make, and what's making it feel so complicated?",
          "Sometimes confusion about decisions comes from having too many good options, or from fear of making the wrong choice. What factors are you trying to balance in this decision?",
          "Decision confusion often happens when our head says one thing but our heart says another, or when we're worried about disappointing others. What's pulling you in different directions?"
        ],
        general: [
          "Feeling confused or lost is actually a very human experience - it often means we're growing or facing something new and complex. What area of your life feels most unclear right now?",
          "Confusion can be uncomfortable because we naturally want clarity and certainty. Sometimes sitting with uncertainty is part of the process of figuring things out. What's been most puzzling or unclear for you?",
          "When everything feels muddled or uncertain, it can be hard to know which way to turn. You're not alone in feeling this way. What would help bring some clarity to your situation?"
        ]
      }
    };

    // Check for specific topics first
    for (const topic of emotion.topics) {
      if (responseTemplates[emotion.type]?.[topic as keyof typeof responseTemplates[typeof emotion.type]]) {
        const topicResponses = responseTemplates[emotion.type][topic as keyof typeof responseTemplates[typeof emotion.type]] as string[];
        return topicResponses[Math.floor(Math.random() * topicResponses.length)];
      }
    }

    // Default to general responses for the emotion type
    const generalResponses = responseTemplates[emotion.type]?.general || responseTemplates.happiness.general;
    // Add intensity modifiers and return response
    let response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    
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
    conversationContext,
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