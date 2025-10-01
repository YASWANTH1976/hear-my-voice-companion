import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

    const systemPrompt = `You are an empathetic mental health companion. Always respond directly to what the user says, in natural spoken-friendly sentences. Keep replies short, supportive, and conversational.

CORE PRINCIPLES:
1. Respond DIRECTLY to the user's exact words and feelings
2. Use natural, conversational language (like speaking to a friend)
3. Keep responses SHORT (1-3 sentences maximum)
4. Be warm, supportive, and non-judgmental
5. Mirror the user's language style
6. Always respond in ${language} language

RESPONSE STYLE:
✓ Natural and conversational ("I hear you", "That sounds really tough")
✓ Validating and empathetic ("It makes sense you'd feel that way")
✓ Short and focused (1-3 sentences)
✓ Direct acknowledgment of what they said
✗ NO clinical language or jargon
✗ NO long paragraphs or lists
✗ NO generic platitudes
✗ NO robotic responses

EMOTION DETECTION:
Detect the primary emotion: anxiety, sadness, anger, stress, happiness, confusion
Assess intensity: low, medium, high
Calculate confidence: 0-1
Identify topics: work, relationships, health, financial, academic, family

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
            description: 'Analyze the user emotion and provide an empathetic response',
            parameters: {
              type: 'object',
              properties: {
                response: { 
                  type: 'string',
                  description: 'Your empathetic response to the user'
                },
                emotion: {
                  type: 'string',
                  description: 'Primary detected emotion'
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

  } catch (error) {
    console.error('Error in generate-response:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
