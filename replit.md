# HearMeOut - AI Mental Health Companion

## Overview

HearMeOut is a comprehensive AI-powered mental health companion application designed to provide emotional support, mood tracking, and wellness tools. The application features multilingual voice interaction (supporting 10+ Indian languages), real-time emotion detection, AI-powered conversational responses, and interactive wellness exercises. Built as a single-page React application, it emphasizes accessibility, privacy, and user safety with features like quick exit functionality and crisis resource integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**UI Framework**: Utilizes shadcn/ui component library built on Radix UI primitives, providing accessible, customizable components with consistent design patterns.

**Styling**: Tailwind CSS with custom HSL-based design system defined in CSS variables. Theme includes emotion-specific colors (anxiety, sadness, anger, stress, happiness, confusion) and wellness-specific colors (breathing, meditation, relaxation, gratitude, grounding).

**State Management**: 
- React Context API for voice interaction state (VoiceContext)
- LocalStorage for persistent data (mood journals, survey responses, accessibility settings, emergency contacts)
- TanStack React Query for server state management (though primarily client-side in current implementation)

**Routing**: React Router for client-side navigation with 404 handling.

**Design Patterns**:
- Component composition with shadcn/ui primitives
- Custom hooks for reusable logic (use-toast, use-mobile)
- Context providers for global state
- Controlled components with form validation

### Core Features & Architecture

**Voice Recognition System**:
- Uses Web Speech API (browser-native)
- Supports 10+ languages with language-specific recognition settings
- Real-time transcription with interim results
- Audio level monitoring for visual feedback
- Fallback error handling for unsupported browsers

**Emotion Detection Engine**:
- Advanced contextual analysis beyond keyword matching
- Handles negations and complex emotional expressions
- Intensity classification (low, medium, high) with confidence scoring
- Topic detection across multiple life areas (work, relationships, health, finances)
- Six primary emotion categories: anxiety, sadness, anger, stress, happiness, confusion

**AI Response Generation**:
- OpenAI API integration for conversational responses
- Quick intent detection for common greetings/farewells to reduce API calls
- Context-aware response generation based on emotion, intensity, and conversation history
- Multilingual support with language detection
- Conversation memory for follow-up awareness

**Accessibility Features**:
- High contrast mode
- Large text option
- Reduced motion preferences
- Screen reader optimization
- Keyboard navigation support
- Settings persisted in localStorage

**Privacy & Safety**:
- Quick Exit button (Ctrl/Cmd + Shift + X) that clears all data and redirects
- No server-side data persistence (all local)
- Crisis helpline integration with regional support
- Emergency contact management

### Data Storage

**Client-Side Storage** (localStorage):
- Mood journal entries
- Survey responses and insights
- User preferences (language, accessibility settings)
- Emergency contacts
- Conversation history
- Analytics data

**No Backend Database**: Application is fully client-side with no server-side data persistence. All user data remains in the browser's localStorage.

### Component Architecture

**Layout Components**:
- Header: Language selection, branding, researcher mode toggle
- Footer: Crisis helplines, mental health resources
- QuickExit: Privacy protection functionality
- AccessibilityEnhancements: Accessibility controls panel

**Core Feature Components**:
- VoiceInterface: Voice recording and transcription UI
- EmotionDisplay: Emotion analysis visualization
- AIResponse: AI-generated response display with TTS
- CopingStrategies: Guided wellness exercises (breathing, meditation)
- MoodJournal: Personal journaling with mood tracking
- QuickMoodCheck: Daily mood assessment tool

**Analytics & Insights**:
- MoodAnalytics: Trend visualization and pattern analysis
- ConversationInsights: Session analysis and recommendations
- SurveyInsights: Age group analysis for researchers
- AgeGroupSurvey: User feedback collection

**Resource Components**:
- ResourceCenter: Curated mental health resources
- EmergencySupport: Crisis intervention contacts
- WellnessExercises: Interactive guided exercises

## External Dependencies

### Third-Party APIs

**OpenAI API**:
- Used for AI response generation
- Configured via `VITE_OPENAI_API_KEY` environment variable
- Currently set to allow browser usage (dangerouslyAllowBrowser: true) - should use backend proxy in production
- Model: GPT-5 (as per latest configuration)
- Functions: Language detection, emotion-aware response generation

### Browser APIs

**Web Speech API**:
- Speech Recognition for voice input
- Speech Synthesis for text-to-speech responses
- No external dependencies, browser-native functionality

### UI Libraries

**Radix UI**: Headless component primitives for accessible UI components
- Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, etc.
- Provides accessibility features out of the box

**shadcn/ui**: Component collection built on Radix UI with Tailwind styling

**Lucide React**: Icon library for consistent iconography

### Utility Libraries

**class-variance-authority**: Type-safe component variants
**clsx** & **tailwind-merge**: Conditional className utilities
**date-fns**: Date manipulation and formatting
**react-hook-form** & **@hookform/resolvers**: Form state management
**embla-carousel-react**: Carousel functionality
**cmdk**: Command menu implementation
**next-themes**: Theme management (light/dark mode support)

### Build Tools

**Vite**: Build tool and development server
**TypeScript**: Type safety with relaxed configuration (strict: false)
**ESLint**: Code linting with React-specific rules
**PostCSS** with **Autoprefixer**: CSS processing
**Tailwind CSS**: Utility-first CSS framework

### Configuration Notes

- TypeScript configured with relaxed rules (noImplicitAny: false, strict: false) for rapid development
- Path aliases configured (@/ maps to ./src/)
- Development server runs on port 5000
- Component tagging enabled in development mode via lovable-tagger