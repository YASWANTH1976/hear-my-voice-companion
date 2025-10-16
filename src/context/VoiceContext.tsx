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

// Language configurations with Indian languages prioritized
export const SUPPORTED_LANGUAGES = {
  'hi-IN': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'te-IN': { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  'ta-IN': { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  'ml-IN': { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  'kn-IN': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  'bn-IN': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  'gu-IN': { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  'mr-IN': { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  'pa-IN': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  'or-IN': { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  'as-IN': { name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  'ne-IN': { name: 'Nepali', nativeName: 'नेपाली', flag: '🇮🇳' },
  'sa-IN': { name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳' },
  'ur-IN': { name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  'en-IN': { name: 'English (India)', nativeName: 'English', flag: '🇮🇳' },
  'en-US': { name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  'es-ES': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'fr-FR': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'de-DE': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  'pt-PT': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'ja-JP': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  'ko-KR': { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  'zh-CN': { name: 'Chinese (Simplified)', nativeName: '中文 (简体)', flag: '🇨🇳' },
  'ar-SA': { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  'ru-RU': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
};

// Emotion types with intensity levels
export interface Emotion {
  type: string;
  intensity: number;
  confidence: number;
  topics: string[];
}

// AI Response types
export interface AIResponse {
  text: string;
  emotion: Emotion;
  timestamp: Date;
  audioBlob?: Blob;
  userTranscript?: string;
}

// Context interface
interface VoiceContextType {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isRecording: boolean;
  isListening: boolean;
  transcript: string;
  audioLevel: number;
  currentEmotion: Emotion | null;
  aiResponse: AIResponse | null;
  responseHistory: AIResponse[];
  conversationContext: string[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
  generateAIResponse: (transcript: string) => Promise<void>;
  speakResponse: (text: string, autoPlay?: boolean) => Promise<Blob | null>;
  currentStrategy: string | null;
  setCurrentStrategy: (strategy: string | null) => void;
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
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
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

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const clearError = useCallback(() => setError(null), []);

  const handleLanguageChange = useCallback((lang: string) => {
    setSelectedLanguage(lang);
    setTranscript('');
    setCurrentEmotion(null);
    setAiResponse(null);
    setResponseHistory([]);
    setConversationContext([]);
    clearError();
  }, [clearError]);

  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);
    
    setAudioLevel(normalizedLevel);
    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setIsListening(true);
        monitorAudioLevel();
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Unable to access microphone');
    }
  }, [selectedLanguage, monitorAudioLevel]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsRecording(false);
    setIsListening(false);
    setAudioLevel(0);

    if (transcript.trim()) {
      generateAIResponse(transcript);
    }
  }, [transcript]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setAiResponse(null);
    setCurrentEmotion(null);
  }, []);

  const generateAIResponse = useCallback(async (text: string) => {
    if (!text.trim()) return;

    try {
      setError(null);
      console.log('Generating AI response for:', text);

      const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
      if (!baseUrl || !anonKey) {
        throw new Error('Backend URL or key missing. Please reload the preview.');
      }

      const resp = await fetch(`${baseUrl}/functions/v1/generate-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          text: text.trim(),
          language: selectedLanguage,
          conversationHistory: conversationContext
        })
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.error || `Function error: ${resp.status}`);
      }

      const data = await resp.json();


      if (!data || !data.text) {
        throw new Error('Invalid response from AI service');
      }

      const emotion: Emotion = {
        type: data.emotion.type,
        intensity: data.emotion.intensity,
        confidence: data.emotion.confidence,
        topics: data.emotion.topics
      };

      setCurrentEmotion(emotion);

      const aiResp: AIResponse = {
        text: data.text,
        emotion,
        timestamp: new Date(),
        userTranscript: text.trim()
      };

      setAiResponse(aiResp);
      setResponseHistory(prev => [aiResp, ...prev.slice(0, 9)]);
      setConversationContext(prev => [
        ...prev.slice(-4),
        `User: ${text}`,
        `Assistant: ${data.text}`
      ]);

      speakResponse(data.text);
    } catch (err) {
      console.error('AI Response Error:', err);
      setError(err instanceof Error ? err.message : 'Unable to generate AI response');
    }
  }, [selectedLanguage, conversationContext]);

  const speakResponse = useCallback(async (text: string, autoPlay: boolean = true) => {
    try {
      console.log('Generating speech for:', text);

      const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
      if (!baseUrl || !anonKey) {
        throw new Error('Backend URL or key missing. Please reload the preview.');
      }

      const resp = await fetch(`${baseUrl}/functions/v1/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          text,
          voice: 'alloy'
        })
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.error || `Function error: ${resp.status}`);
      }

      const data = await resp.json();


      if (!data || !data.audioContent) {
        throw new Error('Invalid audio response');
      }

      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => URL.revokeObjectURL(audioUrl);

      if (autoPlay) {
        await audio.play();
      }

      return audioBlob;
    } catch (err) {
      console.error('Text-to-speech error:', err);
      if (autoPlay && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }
      return null;
    }
  }, [selectedLanguage]);

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
    clearError,
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};
