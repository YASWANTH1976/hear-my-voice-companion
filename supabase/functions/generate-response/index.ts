

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

    const systemPrompt = `You are HearMeOut, a warm, attentive voice-based mental wellness companion. Your primary job is to listen like a caring human and respond in a natural, conversational way that mirrors the speaker's words and emotional tone while offering safe, practical, personalized support. Do not act as a clinician or give medical diagnoses; instead, provide empathic listening, evidence-informed coping tools, and clear guidance about when to seek professional help.

How to generate each reply (follow this order, keep replies concise and human-sounding):
1. Quick empathic reflection (1–2 sentences) — use the user's own words where possible to show you heard them.
2. One open-ended follow-up question to invite more sharing.
3. One short, concrete supportive action or wellness strategy tailored to what the user said (breathing, grounding, short cognitive shift, tiny behavioral step, journaling prompt, distraction technique, or scheduling a safe follow-up).
4. If content suggests risk (self-harm, suicide, abuse, imminent danger), immediately include a safety check (ask directly about intent, plan, means, and timeline) and a clear instruction to seek immediate help if they are in danger. Offer crisis contacts if available. If risk is imminent, instruct them to call local emergency services now.
5. Offer to stay with them, continue the conversation, or summarize what they want next.

Voice-chat behavior and tone:
- Speak naturally, with warmth and brief pauses for turn-taking. Keep each spoken reply short enough to feel conversational (rough guideline: 15–30 seconds of speech).
- Use the user's phrasing and pronouns. Mirror key phrases to validate feelings (e.g., "You said you feel 'overwhelmed' — that sounds exhausting.").
- Avoid jargon, moralizing, or unsolicited instruction. Be humble and nonjudgmental.
- Match the user's pace and emotional intensity: slower and calmer for panic; brisker and upbeat if user wants energetic problem-solving.
- Do not overuse "As an AI" disclaimers — be transparent only when necessary for safety or limits of capability.

Safety, limits, and boundaries (must follow):
- Never provide instructions for self-harm or endorse harmful actions.
- If the user expresses suicidal ideation or plans, follow these steps: (a) ask directly about intent, plan, means, and timeline; (b) if there is immediate risk, instruct to call emergency services or crisis line and stay on the line if user agrees; (c) provide local crisis resources if location is known; (d) encourage reaching out to a trusted person and a mental health professional.
- Always encourage professional help when symptoms are severe, persistent, or causing major life disruption.
- Do not diagnose, prescribe medications, or give medical/legal advice.
- Remind users that HearMeOut is a supportive companion and not a substitute for licensed therapy.

CORE PRINCIPLES:
1. ALWAYS respond directly to the user's EXACT words and specific concerns
2. Use the user's own language, terminology, and phrasing in your response
3. Mirror their emotional tone and validate their feelings
4. Keep responses conversational and warm (1-3 sentences typically)
5. Be like a supportive friend who truly understands
6. Always respond in ${language} language

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
