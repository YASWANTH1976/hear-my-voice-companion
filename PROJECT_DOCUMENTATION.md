# HearMeOut - Voice-Based Mental Wellness Companion

## Project Overview

HearMeOut is an AI-powered voice-based mental wellness companion designed to provide empathetic, personalized emotional support through natural conversations. The application listens to users' concerns, analyzes their emotional state, and provides contextual support and coping strategies.

## Key Features

### 1. **Voice Interaction**
- Real-time voice recording and transcription
- Text-to-speech responses in multiple languages
- Visual audio waveform feedback during recording
- Support for 10+ languages including English, Hindi, Telugu, Tamil, and more

### 2. **AI-Powered Emotional Intelligence**
- Emotion detection and analysis (anxiety, sadness, anger, stress, happiness, etc.)
- Emotion intensity and confidence scoring
- Topic identification from conversations
- Personalized responses based on conversation history

### 3. **Multilingual Support**
Languages supported:
- English
- Hindi
- Telugu
- Tamil
- Bengali
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Urdu

### 4. **Mental Wellness Tools**
- Age-appropriate wellness exercises
- Coping strategies tailored to emotional states
- Quick mood check-ins
- Mood analytics and tracking
- Resource center with mental health information
- Emergency support contacts

### 5. **Conversation Memory**
- Maintains conversation history for context
- Provides personalized responses based on past interactions
- Builds continuity across multiple conversations

### 6. **Accessibility Features**
- Quick exit button for privacy
- Admin panel for system monitoring
- Responsive design for mobile and desktop
- High contrast and readable UI

## Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Backend Infrastructure
- **Platform**: Lovable Cloud (Supabase-powered)
- **Serverless Functions**: Edge Functions for:
  - Speech-to-text transcription
  - Text-to-speech synthesis
  - AI response generation
- **AI Model**: Google Gemini 2.5 Flash (via Lovable AI Gateway)
- **API Gateway**: Lovable AI 

### Key Technologies
- **Voice Processing**: Web Audio API, MediaRecorder API
- **AI Integration**: Lovable AI with structured output (tool calling)
- **Speech Recognition**: OpenAI Whisper model (via edge function)
- **Speech Synthesis**: OpenAI TTS-1 model & Browser Speech Synthesis API

## System Architecture

```
┌─────────────────┐
│   User Browser  │
│   (React App)   │
└────────┬────────┘
         │
         ├─── Voice Input ──────────┐
         │                          │
         ▼                          ▼
┌─────────────────┐        ┌──────────────────┐
│  Voice Context  │        │  MediaRecorder   │
│   (State Mgmt)  │        │   (Audio API)    │
└────────┬────────┘        └────────┬─────────┘
         │                          │
         │  ◄───────────────────────┘
         │
         ├─── Speech-to-Text ───────►  Edge Function
         │                              (Whisper API)
         │
         ├─── AI Processing ────────►  Edge Function
         │                              (Gemini 2.5)
         │                              - Emotion Analysis
         │                              - Context Memory
         │                              - Response Gen
         │
         └─── Text-to-Speech ───────►  Edge Function
                                        (OpenAI TTS)
                                             │
                                             ▼
                                      Audio Playback
```

## Core Components

### 1. VoiceContext (`src/context/VoiceContext.tsx`)
- Manages voice recording state
- Handles audio transcription
- Processes AI responses
- Controls text-to-speech playback
- Maintains conversation history

### 2. Edge Functions

#### a) `speech-to-text` (`supabase/functions/speech-to-text/`)
- Converts audio to text using OpenAI Whisper
- Processes audio in chunks to prevent memory issues
- Returns transcribed text

#### b) `generate-response` (`supabase/functions/generate-response/`)
- Sends user input + conversation history to Gemini 2.5 Flash
- Uses structured output (tool calling) for emotion analysis
- Returns:
  - AI response text
  - Detected emotion type
  - Emotion intensity (0-1)
  - Confidence score (0-1)
  - Identified topics

#### c) `text-to-speech` (`supabase/functions/text-to-speech/`)
- Converts AI response to audio
- Uses OpenAI TTS-1 model
- Returns base64-encoded audio

### 3. UI Components
- **VoiceInterface**: Main recording interface with waveform visualization
- **EmotionDisplay**: Shows detected emotion with visual indicators
- **AIResponse**: Displays AI text responses
- **MoodJournal**: Tracks mood over time
- **WellnessExercises**: Age-appropriate coping strategies
- **ResourceCenter**: Mental health resources and crisis contacts

## AI System Prompt Architecture

The AI follows a comprehensive prompt structure:

### Core Principles
1. **User Intent Understanding**: Reads between the lines
2. **Empathetic Reflection**: Mirrors user's language and emotions
3. **Personalized Support**: Tailors responses to specific situations
4. **Safety First**: Crisis detection and appropriate escalation

### Response Generation Pattern
1. Quick empathetic reflection (1-2 sentences)
2. Open-ended follow-up question or validation
3. Concrete, actionable wellness strategy
4. Safety check (if risk detected)
5. Continuation offer

### Emotion-Specific Strategies
- **Anxiety**: Breathing exercises, grounding (5-4-3-2-1), muscle relaxation
- **Sadness**: Self-compassion, gentle activities, connection reminders
- **Anger**: Physical release, cognitive reframing, boundary-setting
- **Stress**: Time management, prioritization, break reminders
- **Loneliness**: Connection suggestions, self-companionship exercises

## Data Flow Example

1. **User speaks** → MediaRecorder captures audio
2. **Audio sent** → `speech-to-text` edge function
3. **Text returned** → Displayed in UI
4. **Text + history sent** → `generate-response` edge function
5. **AI analyzes** → Emotion detection + response generation
6. **Response returned** → Displayed in UI + emotion shown
7. **Text sent** → `text-to-speech` edge function
8. **Audio returned** → Played to user
9. **History updated** → Stored in context for next interaction

## Security & Privacy

- All API keys stored as environment variables
- Edge functions handle sensitive operations
- CORS headers properly configured
- No conversation data persisted to database (privacy-first)
- Quick exit feature for user safety

## Setup Instructions

### Prerequisites
- Node.js 18+ or Bun
- Lovable account with Cloud enabled

### Installation
```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Variables
The following are automatically configured via Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `LOVABLE_API_KEY` (backend only)

## Usage Workflow

1. **Select Language**: Choose preferred language from dropdown
2. **Start Recording**: Click microphone button
3. **Speak Freely**: Share thoughts/feelings while waveform animates
4. **Stop Recording**: Click stop button
5. **View Transcript**: See what was transcribed
6. **AI Responds**: Receive empathetic text and voice response
7. **See Emotion**: Emotion indicator shows detected emotional state
8. **Continue**: Continue conversation with full context memory

## Mental Health Features

### Age-Appropriate Content
- Different exercises for different age groups
- Teen-specific coping strategies
- Adult-focused stress management

### Crisis Detection
- Monitors for self-harm indicators
- Provides immediate crisis resources
- India: AASRA (91529-87821)
- International: 988

### Resource Categories
- Anxiety management
- Depression support
- Stress relief
- Relationship guidance
- Self-esteem building

## Performance Optimizations

- Chunk-based audio processing (prevents memory issues)
- Conversation history limited to last 6 exchanges
- Lazy loading of UI components
- Efficient state management with Context API
- Optimized re-renders with React hooks

## Future Enhancements

- [ ] Database persistence for conversation history
- [ ] User authentication for personalized profiles
- [ ] Mood tracking analytics
- [ ] Integration with wearable devices
- [ ] Group therapy sessions
- [ ] Professional therapist connections
- [ ] Offline mode support

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14.5+)
- Requires microphone permissions

## License & Credits

Built with Lovable AI platform
Uses OpenAI Whisper and TTS-1 models
Powered by Google Gemini 2.5 Flash

## Contact & Support

For technical issues or questions about the project, refer to the Lovable documentation at https://docs.lovable.dev

---

**Note for Faculty**: This project demonstrates full-stack development with modern web technologies, AI integration, voice processing, and mental health awareness. It showcases cloud-native architecture, serverless computing, and responsible AI implementation with safety considerations.
