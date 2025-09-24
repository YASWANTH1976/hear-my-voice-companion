import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

// For frontend applications, we'll need to use a server-side proxy in production
// For now, we'll check if the API key is available
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.');
  }
  
  return new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true 
  });
};

interface EmotionAnalysis {
  emotion: 'anxiety' | 'sadness' | 'anger' | 'stress' | 'happiness' | 'confusion';
  intensity: 'low' | 'medium' | 'high';
  confidence: number;
  topics: string[];
}

interface AIResponseData {
  response: string;
  emotion: EmotionAnalysis;
  language: string;
}

export async function generateAIResponse(
  userInput: string,
  selectedLanguage: string,
  conversationHistory: string[] = []
): Promise<AIResponseData> {
  try {
    const openai = getOpenAIClient();

    const languageMap: { [key: string]: string } = {
      'hi-IN': 'Hindi (हिन्दी)',
      'te-IN': 'Telugu (తెలుగు)',
      'ta-IN': 'Tamil (தமিழ்)',
      'ml-IN': 'Malayalam (മലയാളം)',
      'kn-IN': 'Kannada (ಕನ್ನಡ)',
      'bn-IN': 'Bengali (বাংলা)',
      'gu-IN': 'Gujarati (ગુજરાતી)',
      'mr-IN': 'Marathi (मराठी)',
      'pa-IN': 'Punjabi (ਪੰਜਾਬੀ)',
      'or-IN': 'Odia (ଓଡ଼ିଆ)',
      'as-IN': 'Assamese (অসমীয়া)',
      'ne-IN': 'Nepali (नेपाली)',
      'sa-IN': 'Sanskrit (संस्कृतम्)',
      'ur-IN': 'Urdu (اردو)',
      'en-IN': 'English (India)',
      'en-US': 'English (US)',
      'es-ES': 'Spanish (Español)',
      'fr-FR': 'French (Français)',
      'de-DE': 'German (Deutsch)',
      'pt-PT': 'Portuguese (Português)',
      'ja-JP': 'Japanese (日本語)',
      'ko-KR': 'Korean (한국어)',
      'zh-CN': 'Chinese Simplified (中文简体)',
      'ar-SA': 'Arabic (العربية)',
      'ru-RU': 'Russian (Русский)'
    };

    const targetLanguage = languageMap[selectedLanguage] || 'English';
    const historyContext = conversationHistory.length > 0 
      ? `\n\nConversation history:\n${conversationHistory.slice(-3).join('\n')}`
      : '';

    const systemPrompt = `You are HearMeOut, a compassionate AI mental health companion. Your role is to:

1. Provide empathetic, supportive responses to users sharing their mental health concerns
2. Respond ALWAYS in ${targetLanguage} language, matching the user's cultural context
3. Offer practical coping strategies and emotional support
4. Recognize crisis situations and provide appropriate emergency guidance
5. Maintain a warm, non-judgmental, and professional tone
6. Keep responses conversational, human-like, and personally relevant

CRITICAL GUIDELINES:
- ALWAYS respond in ${targetLanguage} language only
- Be conversational like a supportive friend, not clinical
- Focus on validation and practical support
- If detecting crisis/self-harm, acknowledge seriously and suggest professional help
- Keep responses 2-3 sentences, warm and personal
- Match the emotional tone appropriately

Analyze the user's input and provide:
1. A supportive response in ${targetLanguage}
2. Emotion analysis
3. Relevant topics mentioned

Respond in JSON format with this structure:
{
  "response": "Your supportive response in ${targetLanguage}",
  "emotion": "anxiety|sadness|anger|stress|happiness|confusion",
  "intensity": "low|medium|high", 
  "confidence": 0.85,
  "topics": ["topic1", "topic2"],
  "language": "${selectedLanguage}"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${userInput}${historyContext}` }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      response: result.response || "I'm here to listen and support you.",
      emotion: {
        emotion: result.emotion || 'confusion',
        intensity: result.intensity || 'medium',
        confidence: result.confidence || 0.5,
        topics: result.topics || []
      },
      language: result.language || selectedLanguage
    };

  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response in the selected language
    const fallbackResponses: { [key: string]: string } = {
      'hi-IN': 'मैं यहाँ आपकी बात सुनने और आपका साथ देने के लिए हूँ। कृपया फिर से कोशिश करें।',
      'te-IN': 'నేను మీ మాట వినడానికి మరియు మీకు మద్దతు ఇవ్వడానికి ఇక్కడ ఉన్నాను। దయచేసి మళ్ళీ ప్రయత్నించండి।',
      'ta-IN': 'நான் உங்களைக் கேட்கவும் ஆதரவளிக்கவும் இங்கே இருக்கிறேன். தயவுசெய்து மீண்டும் முயற்சிக்கவும்।',
      'es-ES': 'Estoy aquí para escucharte y apoyarte. Por favor, inténtalo de nuevo.',
      'fr-FR': 'Je suis là pour vous écouter et vous soutenir. Veuillez réessayer.',
      'de-DE': 'Ich bin hier, um zuzuhören und Sie zu unterstützen. Bitte versuchen Sie es erneut.',
      'default': 'I\'m here to listen and support you. Please try again.'
    };

    return {
      response: fallbackResponses[selectedLanguage] || fallbackResponses.default,
      emotion: {
        emotion: 'confusion',
        intensity: 'low',
        confidence: 0.3,
        topics: []
      },
      language: selectedLanguage
    };
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Detect the language of the given text and return the appropriate language code from this list:
hi-IN, te-IN, ta-IN, ml-IN, kn-IN, bn-IN, gu-IN, mr-IN, pa-IN, or-IN, as-IN, ne-IN, sa-IN, ur-IN, en-IN, en-US, es-ES, fr-FR, de-DE, pt-PT, ja-JP, ko-KR, zh-CN, ar-SA, ru-RU

Respond with JSON: {"language": "language-code"}`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.language || 'en-US';
    
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en-US';
  }
}