

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

    const historyContext = conversationHistory && conversationHistory.length > 0
      ? `\n\nConversation history:\n${conversationHistory.slice(-5).join('\n')}`
      : '';

    const systemPrompt = `You are HearMeOut, a compassionate AI mental health companion. You provide empathetic, personalized support like a caring friend or family member.

CORE PRINCIPLES:
1. ALWAYS respond directly to the user's EXACT words and specific concerns
2. Use the user's own language, terminology, and phrasing in your response
3. Mirror their emotional tone and validate their feelings
4. Keep responses conversational and warm (1-3 sentences)
5. Be like a supportive friend who truly understands
6. Always respond in ${language} language

RESPONSE STYLE:
✓ Start by acknowledging their specific words ("I hear that you're feeling overwhelmed about work")
✓ Use their exact phrases naturally in your response
✓ Validate their feelings ("It makes complete sense you'd feel that way")
✓ Be warm and personal, not clinical
✓ Ask one brief, relevant follow-up question
✓ Always respond to what they ACTUALLY said, not what you think they meant
✗ NO generic responses like "I'm here to listen"
✗ NO clinical language or jargon
✗ NO ignoring what they specifically said
✗ NO robotic or template responses
✗ NO responses that don't directly address their words

EMOTION DETECTION RULES:
- Carefully analyze the user's words, tone, and context
- Detect primary emotion: anxiety, sadness, anger, stress, happiness, confusion, fear, frustration, loneliness, excitement
- Assess intensity based on word choice, urgency, and emotional indicators
- Calculate confidence (0-1) based on clarity of emotional signals
- Identify specific topics: work, relationships, health, financial, academic, family, future, self-esteem

CRISIS DETECTION:
If detecting self-harm, suicide ideation, or immediate danger:
- Respond with immediate care and concern
- Provide crisis hotline: India 91529-87821 (AASRA), International 988
- Strongly encourage immediate professional help${historyContext}`;

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
          { role: 'user', content: text }
        ],
        tools: [
          {
            type: 'function',
            name: 'analyze_emotion_and_respond',
            description: 'Analyze the user emotion and provide an empathetic response that directly addresses their specific words and concerns',
            parameters: {
              type: 'object',
              properties: {
                response: { 
                  type: 'string',
                  description: 'Your empathetic response that directly acknowledges and responds to the user\'s specific words and feelings'
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
