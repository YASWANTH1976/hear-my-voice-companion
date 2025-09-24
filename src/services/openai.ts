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

const QUICK_INTENTS_ENABLED = (import.meta.env.VITE_QUICK_INTENTS_ENABLED ?? 'true') !== 'false';

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function detectQuickIntent(text: string): 'greeting' | 'thanks' | 'goodbye' | 'howareyou' | null {
  const t = normalize(text);

  const greeting = [
    // English + common
    'hi', 'hello', 'hey', 'yo', 'hiya', 'good morning', 'good afternoon', 'good evening',
    // Indic
    'नमस्ते', 'नमस्कार', 'नमस्ते!', 'नमस्कार!', 'नमस्ते।', 'नमस्कार।', // hi
    'నమస్తే', 'నమస్కారం', // te
    'வணக்கம்', 'வணக்கம்!', // ta
    'നമസ്കാരം', // ml
    'ನಮಸ್ಕಾರ', // kn
    'নমস্কার', 'নমস্কার!', // bn
    'નમસ્તે', // gu
    'नमस्कार', // mr
    'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ!', // pa
    'ନମସ୍କାର', // or
    'سلام', 'السلام عليكم', // ur/ar
    // Other
    'hola', 'bonjour', 'hallo', 'olá', 'ciao', 'こんにちは', '你好', '안녕하세요', 'привет', 'marhaba', 'مرحبا'
  ];

  const thanks = [
    'thanks', 'thank you', 'ty', 'thx', 'gracias', 'merci', 'danke', 'obrigado', 'obrigada', 'grazie',
    'धन्यवाद', 'शुक्रिया', 'ধন্যবাদ', 'ধন্যবাদ!', 'شكراً', 'شكرا', '谢谢', 'ありがとう', '감사합니다', 'спасибо'
  ];

  const goodbye = [
    'bye', 'goodbye', 'see you', 'take care', 'later', 'ciao', 'adiós', 'adios', 'au revoir', 'tschüss', 'tchau',
    'अलविदा', 'फिर मिलेंगे', 'বিদায়', 'খোদা হাফিজ', 'مع السلامة', '再见', 'さようなら', '안녕히 계세요', 'пока'
  ];

  const howAreYou = [
    'how are you', 'how r u', 'hru', 'how do you feel', 'what about you',
    'कैसे हो', 'कैसे हैं', 'तुम कैसे हो',
    'আপনি কেমন আছেন', 'তুমি কেমন আছ',
    'كيف حالك', 'كيفك',
    'como estás', 'comment ça va', 'wie gehts', 'wie geht\'s', 'como vai',
    'お元気ですか', '元気', '잘 지내', '你好吗'
  ];

  if (greeting.some(p => t.includes(p))) return 'greeting';
  if (thanks.some(p => t.includes(p))) return 'thanks';
  if (goodbye.some(p => t.includes(p))) return 'goodbye';
  if (howAreYou.some(p => t.includes(p))) return 'howareyou';
  return null;
}

async function getQuickReply(intent: 'greeting' | 'thanks' | 'goodbye' | 'howareyou', lang: string): Promise<string> {
  const replies: Record<string, Record<string, string[]>> = {
    greeting: {
      'en': ["Hi! I'm here with you. How are you feeling today?"],
      'hi-IN': ['नमस्ते! मैं आपकी बात सुनने के लिए यहाँ हूँ। आज आप कैसा महसूस कर रहे हैं?'],
      'es-ES': ['¡Hola! Estoy aquí para escucharte. ¿Cómo te sientes hoy?'],
      'fr-FR': ["Bonjour ! Je suis là pour t'écouter. Comment te sens-tu aujourd'hui ?"],
      'de-DE': ['Hallo! Ich bin da, um dir zuzuhören. Wie fühlst du dich heute?'],
      'pt-PT': ['Olá! Estou aqui para te ouvir. Como te sentes hoje?'],
      'ja-JP': ['こんにちは。あなたの話を聞くためにここにいます。今日はどんな気分ですか？'],
      'ko-KR': ['안녕하세요. 당신의 이야기를 듣고 있어요. 오늘 기분이 어떠세요?'],
      'zh-CN': ['你好！我在这里倾听你。你今天感觉怎么样？'],
      'ar-SA': ['مرحبًا! أنا هنا للاستماع إليك. كيف تشعر اليوم؟'],
      'ru-RU': ['Привет! Я здесь, чтобы тебя выслушать. Как ты себя чувствуешь сегодня?']
    },
    thanks: {
      'en': ["You're welcome. Anything else on your mind?"],
      'hi-IN': ['आपका स्वागत है। क्या कुछ और साझा करना चाहेंगे?'],
      'es-ES': ['De nada. ¿Hay algo más que quieras compartir?'],
      'fr-FR': ["Avec plaisir. Tu veux parler d'autre chose ?"],
      'de-DE': ['Gern geschehen. Möchtest du noch über etwas sprechen?'],
      'pt-PT': ['De nada. Queres falar de mais alguma coisa?'],
      'ja-JP': ['どういたしまして。他に話したいことはありますか？'],
      'ko-KR': ['천만에요. 다른 이야기해보고 싶으신가요?'],
      'zh-CN': ['不客气。还有其他想说的吗？'],
      'ar-SA': ['على الرحب والسعة. هل هناك شيء آخر تود الحديث عنه؟'],
      'ru-RU': ['Пожалуйста. Хочешь обсудить что-то еще?']
    },
    goodbye: {
      'en': ['Take care. I’m here whenever you need.'],
      'hi-IN': ['अपना ख्याल रखें। जब भी ज़रूरत हो, मैं यहाँ हूँ।'],
      'es-ES': ['Cuídate. Estoy aquí cuando me necesites.'],
      'fr-FR': ["Prends soin de toi. Je suis là quand tu as besoin."],
      'de-DE': ['Pass auf dich auf. Ich bin da, wenn du mich brauchst.'],
      'pt-PT': ['Cuida-te. Estou aqui sempre que precisares.'],
      'ja-JP': ['お大事に。必要なときはいつでもいます。'],
      'ko-KR': ['몸 조심하세요. 필요할 때 언제든 있어요.'],
      'zh-CN': ['保重。需要时我一直在。'],
      'ar-SA': ['اعتنِ بنفسك. أنا هنا متى ما احتجت.'],
      'ru-RU': ['Береги себя. Я рядом, когда понадоблюсь.']
    },
    howareyou: {
      'en': ["Thanks for asking. I'm here for you—how are you feeling?"],
      'hi-IN': ['पूछने के लिए धन्यवाद। मैं आपके साथ हूँ — आप कैसा महसूस कर रहे हैं?'],
      'es-ES': ['Gracias por preguntar. Estoy aquí para ti—¿cómo te sientes?'],
      'fr-FR': ["Merci de demander. Je suis là pour toi — comment te sens-tu ?"],
      'de-DE': ['Danke der Nachfrage. Ich bin für dich da – wie fühlst du dich?'],
      'pt-PT': ['Obrigado por perguntar. Estou aqui para ti — como te sentes?'],
      'ja-JP': ['聞いてくれてありがとう。私はあなたのためにここにいます。今はどんな気持ち？'],
      'ko-KR': ['물어봐줘서 고마워요. 저는 당신을 위해 여기 있어요—지금 기분이 어떠세요?'],
      'zh-CN': ['谢谢关心。我在这里陪着你——你现在感觉如何？'],
      'ar-SA': ['شكرًا لسؤالك. أنا هنا من أجلك — كيف تشعر؟'],
      'ru-RU': ['Спасибо, что спросил(а). Я здесь для тебя — как ты себя чувствуешь?']
    }
  };

  const root = lang.startsWith('en-') ? 'en' : lang;
  const localized = replies[intent][root];
  if (localized && localized.length > 0) {
    return localized[Math.floor(Math.random() * localized.length)];
  }
  const english = replies[intent]['en'];
  const base = english[Math.floor(Math.random() * english.length)];
  if (!root.startsWith('en')) {
    return await translateText(base, lang);
  }
  return base;
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
7. Be specific to the user's exact words; avoid generic platitudes
8. Always end with one short, relevant follow-up question to gently continue the conversation

CRITICAL GUIDELINES:
- ALWAYS respond in ${targetLanguage} language only
- Be conversational like a supportive friend, not clinical
- Mirror back 2-6 of the user's own words naturally so it feels personal
- Focus on validation and practical support tailored to what they said
- If detecting crisis/self-harm, acknowledge seriously and suggest professional help (hotline numbers if appropriate)
- Prefer 1-2 sentences (max 3), warm and personal, no lists
- Match the emotional tone appropriately and directly reference specific details mentioned
- Do NOT use generic filler like "I'm here to listen" unless the user asked about your role

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
  "language": "${selectedLanguage}",
  "follow_up": "One short, relevant question in ${targetLanguage}"
}`;

    // Quick-intent path for immediate, human-like replies to short utterances
    if (QUICK_INTENTS_ENABLED) {
      const quick = detectQuickIntent(userInput);
      if (quick) {
        const quickReply = await getQuickReply(quick, selectedLanguage);
        return {
          response: quickReply,
          emotion: {
            emotion: quick === 'thanks' ? 'happiness' : 'happiness',
            intensity: 'low',
            confidence: 0.9,
            topics: []
          },
          language: selectedLanguage
        };
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${userInput}${historyContext}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      presence_penalty: 0.2,
      frequency_penalty: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    const combinedResponse = (() => {
      const base = (result.response || "I'm here to listen and support you.").trim();
      const follow = (result.follow_up || '').trim();
      if (!follow) return base;
      // Join with a space for natural flow
      return `${base} ${follow}`.trim();
    })();

    return {
      response: combinedResponse,
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

    const base = fallbackResponses[selectedLanguage] || fallbackResponses.default;
    const localized = await translateText(base, selectedLanguage);

    return {
      response: localized,
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
    // Heuristic script-based detection for speed and reliability (no network)
    const scriptDetectors: Array<{ regex: RegExp; code: string }> = [
      { regex: /[\u0900-\u097F]/, code: 'hi-IN' }, // Devanagari
      { regex: /[\u0C00-\u0C7F]/, code: 'te-IN' }, // Telugu
      { regex: /[\u0B80-\u0BFF]/, code: 'ta-IN' }, // Tamil
      { regex: /[\u0D00-\u0D7F]/, code: 'ml-IN' }, // Malayalam
      { regex: /[\u0C80-\u0CFF]/, code: 'kn-IN' }, // Kannada
      { regex: /[\u0980-\u09FF]/, code: 'bn-IN' }, // Bengali/Assamese
      { regex: /[\u0A80-\u0AFF]/, code: 'gu-IN' }, // Gujarati
      { regex: /[\u0A00-\u0A7F]/, code: 'pa-IN' }, // Gurmukhi (Punjabi)
      { regex: /[\u0B00-\u0B7F]/, code: 'or-IN' }, // Odia
      { regex: /[\u0600-\u06FF]/, code: 'ur-IN' }, // Arabic script (Urdu default)
      { regex: /[\u4E00-\u9FFF]/, code: 'zh-CN' }, // CJK Unified Ideographs
      { regex: /[\u3040-\u309F\u30A0-\u30FF]/, code: 'ja-JP' }, // Japanese Hiragana/Katakana
      { regex: /[\uAC00-\uD7AF]/, code: 'ko-KR' }, // Hangul
      { regex: /[\u0400-\u04FF]/, code: 'ru-RU' }, // Cyrillic
    ];

    for (const detector of scriptDetectors) {
      if (detector.regex.test(text)) {
        return detector.code;
      }
    }

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

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    // Short-circuit for English variants
    if (targetLanguage.startsWith('en-')) return text;

    const languageMap: { [key: string]: string } = {
      'hi-IN': 'Hindi (हिन्दी)',
      'te-IN': 'Telugu (తెలుగు)',
      'ta-IN': 'Tamil (தமிழ்)',
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

    const openai = getOpenAIClient();
    const lang = languageMap[targetLanguage] || 'the target language';
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: `Translate the user's message into ${lang}. Keep tone, warmth, and informality. Respond with ONLY the translated text, no quotes.` },
        { role: 'user', content: text }
      ]
    });
    const translated = response.choices?.[0]?.message?.content?.trim();
    return translated || text;
  } catch (error) {
    console.warn('Translation failed, returning original text.', error);
    return text;
  }
}