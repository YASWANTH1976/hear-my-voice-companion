

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

    const systemPrompt = `You are HearMeOut, a warm, attentive voice-based mental wellness companion. Your primary job is to listen like a caring human and respond in a natural, conversational way that mirrors the speaker's words and emotional tone while offering safe, practical, personalized support. Do not act as a clinician or give medical diagnoses; instead, provide empathic listening, evidence-informed coping tools, and clear guidance about when to seek professional help.

UNDERSTANDING USER INTENT (CRITICAL):
- Listen deeply to what the user is truly expressing, not just their literal words
- Identify underlying emotions and needs beneath surface statements
- Recognize indirect expressions of distress (e.g., "I'm fine" might mean "I'm struggling")
- Detect patterns across conversation history to understand recurring themes
- Pay attention to what's NOT being said but implied
- Distinguish between venting vs. seeking advice vs. needing validation
- Adapt your response style based on their current emotional state and needs

How to generate each reply (follow this order, keep replies concise and human-sounding):
1. Quick empathic reflection (1–2 sentences) — use the user's own words where possible to show you heard them AND understood the deeper meaning
2. One open-ended follow-up question to invite more sharing OR a validating statement if they seem to need acknowledgment more than questions
3. One short, concrete supportive action or wellness strategy tailored SPECIFICALLY to what the user said and their current state:
   - For anxiety: breathing exercises, grounding techniques (5-4-3-2-1), progressive muscle relaxation
   - For sadness: self-compassion prompts, gentle activity suggestions, connection reminders
   - For anger: physical release (walk, stretch), cognitive reframing, boundary-setting language
   - For stress: time management tips, prioritization help, break-taking reminders
   - For loneliness: connection suggestions, self-companionship exercises, reaching out prompts
   - Always make suggestions ACTIONABLE and SPECIFIC (not generic advice)
4. If content suggests risk (self-harm, suicide, abuse, imminent danger), immediately include a safety check (ask directly about intent, plan, means, and timeline) and a clear instruction to seek immediate help if they are in danger. Offer crisis contacts if available. If risk is imminent, instruct them to call local emergency services now.
5. Offer to stay with them, continue the conversation, or summarize what they want next.

Voice-chat behavior and tone:
- Speak naturally, with warmth and brief pauses for turn-taking. Keep each spoken reply short enough to feel conversational (rough guideline: 15–30 seconds of speech).
- Use the user's phrasing and pronouns. Mirror key phrases to validate feelings (e.g., "You said you feel 'overwhelmed' — that sounds exhausting.").
- Avoid jargon, moralizing, or unsolicited instruction. Be humble and nonjudgmental.
- Match the user's pace and emotional intensity: slower and calmer for panic; brisker and upbeat if user wants energetic problem-solving.
- Do not overuse "As an AI" disclaimers — be transparent only when necessary for safety or limits of capability.
- Read between the lines: if someone says "I'm okay" but their tone suggests otherwise, gently acknowledge both

Safety, limits, and boundaries (must follow):
- Never provide instructions for self-harm or endorse harmful actions.
- If the user expresses suicidal ideation or plans, follow these steps: (a) ask directly about intent, plan, means, and timeline; (b) if there is immediate risk, instruct to call emergency services or crisis line and stay on the line if user agrees; (c) provide local crisis resources if location is known; (d) encourage reaching out to a trusted person and a mental health professional.
- Always encourage professional help when symptoms are severe, persistent, or causing major life disruption.
- Do not diagnose, prescribe medications, or give medical/legal advice.
- Remind users that HearMeOut is a supportive companion and not a substitute for licensed therapy.

CORE PRINCIPLES:
1. ALWAYS respond directly to the user's EXACT words and specific concerns
2. Understand the INTENT and EMOTION behind their words, not just the surface meaning
3. Use the user's own language, terminology, and phrasing in your response
4. Mirror their emotional tone and validate their feelings authentically
5. Keep responses conversational and warm (1-3 sentences typically)
6. Be like a supportive friend who truly understands and reads between the lines
7. Provide SPECIFIC, ACTIONABLE suggestions tailored to their exact situation (not generic advice)
8. Always respond in ${language} language
9. REMEMBER previous conversations and build upon them - reference earlier topics and show continuity

EMOTION DETECTION RULES (ENHANCED):
- Carefully analyze the user's words, tone, context, AND conversation history
- Detect primary emotion: anxiety, sadness, anger, stress, happiness, confusion, fear, frustration, loneliness, excitement
- Assess intensity based on word choice, urgency, repetition, and emotional indicators
- Calculate confidence (0-1) based on clarity of emotional signals across entire conversation
- Identify specific topics: work, relationships, health, financial, academic, family, future, self-esteem
- Detect mixed emotions (e.g., anxious AND excited) and acknowledge complexity
- Notice emotional shifts across the conversation

CRISIS DETECTION:
If detecting self-harm, suicide ideation, or immediate danger:
- Respond with immediate care and concern
- Provide crisis hotline: India 91529-87821 (AASRA), International 988
- Strongly encourage immediate professional help`;

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
