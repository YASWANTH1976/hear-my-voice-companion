import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    const systemPrompt = `You are a compassionate mental health companion named HearMeOut. Your role is to:

1. Listen actively and empathetically to users' feelings and concerns
2. Provide emotional support and validation
3. Offer gentle guidance and coping strategies when appropriate
4. Detect emotional states and respond with appropriate empathy
5. Maintain a warm, supportive, and non-judgmental tone
6. Encourage users to seek professional help when needed

CRITICAL CRISIS DETECTION:
If the user expresses:
- Suicidal thoughts or self-harm intentions
- Immediate danger to themselves or others
- Severe mental health crisis

You MUST:
1. Express immediate concern and care
2. Encourage them to contact emergency services or crisis hotlines
3. Provide crisis resources appropriate to their region

Response Guidelines:
- Keep responses conversational and natural (2-4 sentences typically)
- Use ${language} language
- Show empathy and understanding
- Ask clarifying questions when helpful
- Provide actionable suggestions when appropriate
- Never diagnose or provide medical advice
- Encourage professional help for serious concerns

Emotion Analysis:
Analyze the user's emotional state and include it in your response JSON with:
- emotion: primary emotion (happy, sad, anxious, angry, neutral, etc.)
- intensity: 0-1 scale
- confidence: 0-1 scale  
- topics: array of relevant topics mentioned

Previous conversation context:
${conversationHistory ? conversationHistory.join('\n') : 'This is the start of the conversation.'}`;

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
