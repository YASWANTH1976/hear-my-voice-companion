

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text, language, conversationHistory } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    console.log('Generating response for:', text);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Convert conversation history into proper message format
    const conversationMessages = [];
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-6).forEach((entry: string) => {
        if (entry.startsWith('User: ')) {
          conversationMessages.push({
            role: 'user',
            content: entry.replace('User: ', '')
          });
        } else if (entry.startsWith('Assistant: ')) {
          conversationMessages.push({
            role: 'assistant',
            content: entry.replace('Assistant: ', '')
          });
        }
      });
    }

    const systemPrompt = `You are HearMeOut, a warm voice-based mental wellness companion.

CRITICAL - RESPONSE LENGTH (MUST FOLLOW):
- Maximum 2-3 sentences ONLY
- After your response, ask ONE specific follow-up question OR offer ONE actionable solution
- Keep responses conversational and concise
- NO long explanations or multiple suggestions

How to respond:
1. One empathetic sentence acknowledging their feeling using their own words
2. ONE follow-up question to understand better OR ONE specific actionable suggestion
3. That's it - STOP there

Examples of GOOD responses:
"I hear that you're feeling overwhelmed with work. What's the biggest source of stress right now?"
"It sounds like you're having a tough day. Would taking a 5-minute walk help clear your mind?"

Examples of BAD responses (TOO LONG):
"I can sense happiness quite strongly in what you've shared. It seems to be related to general well that. It sounds like you, re feeling really good today..." [STOP - this is way too long]

EMOTION DETECTION:
- Detect primary emotion: anxiety, sadness, anger, stress, happiness, confusion, fear, frustration, loneliness, excitement
- Assess intensity (0-1) and confidence (0-1)
- Identify specific topics mentioned
- Always respond in ${language} language
- Remember previous conversation context

CRISIS DETECTION:
If detecting self-harm or suicide ideation:
- Respond with immediate care
- Provide crisis hotline: India 91529-87821 (AASRA), International 988
- Keep response brief but direct`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationMessages,
          { role: 'user', content: text }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_emotion_and_respond',
              description: 'Analyze the user emotion and provide an empathetic response that directly addresses their specific words and concerns',
              parameters: {
                type: 'object',
                properties: {
                  response: { 
                    type: 'string',
                    description: 'MAXIMUM 2-3 short sentences. One empathetic acknowledgment + one follow-up question OR one actionable suggestion. STOP after that. Keep it brief and conversational.'
                  },
                  emotion: {
                    type: 'string',
                    description: 'Primary detected emotion: anxiety, sadness, anger, stress, happiness, confusion, fear, frustration, loneliness, excitement'
                  },
                  intensity: {
                    type: 'number',
                    description: 'Emotion intensity from 0 to 1'
                  },
                  confidence: {
                    type: 'number',
                    description: 'Confidence in emotion detection from 0 to 1'
                  },
                  topics: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Relevant topics mentioned by user'
                  }
                },
                required: ['response', 'emotion', 'intensity', 'confidence', 'topics'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_emotion_and_respond' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`Lovable AI error: ${errorText}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        text: result.response,
        emotion: {
          type: result.emotion,
          intensity: result.intensity,
          confidence: result.confidence,
          topics: result.topics
        },
        language: language
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (err) {
    console.error('Error in generate-response:', err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
