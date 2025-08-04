# HearMeOut - AI Mental Health Companion

![HearMeOut](https://img.shields.io/badge/HearMeOut-AI%20Mental%20Health%20Companion-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)

A comprehensive, production-ready mental health companion featuring AI-powered emotional support, voice interaction, mood tracking, and interactive wellness tools. Built with modern web technologies and designed for privacy-first mental health support.

## 🌟 Features

### 🎤 Advanced Voice Interface & Recognition
- Real-time voice recognition using Web Speech API
- Live transcription display with visual feedback
- Animated waveform visualization during recording
- Language-specific speech recognition for 10+ languages
- Visual recording states with color-coded feedback
- Replay and clear functionality for voice inputs

### 🌍 Comprehensive Multilingual Support
Support for 10+ languages with native script display:
- **English** (en-IN)
- **Hindi** (हिंदी) - hi-IN
- **Telugu** (తెలుగు) - te-IN
- **Tamil** (தமிழ்) - ta-IN
- **Kannada** (ಕನ್ನಡ) - kn-IN
- **Malayalam** (മലയാളം) - ml-IN
- **Bengali** (বাংলা) - bn-IN
- **Gujarati** (ગુજરાતી) - gu-IN
- **Marathi** (मराठी) - mr-IN
- **Punjabi** (ਪੰਜਾਬੀ) - pa-IN

### 🧠 Intelligent Emotion Detection & Analysis
- Advanced contextual emotion analysis beyond keyword matching
- Handles negations and complex emotional expressions
- Intensity levels: low, medium, high with confidence scoring
- Visual progress bars for emotion confidence
- Multiple emotion categories:
  - Anxiety/Fear with topic-specific responses
  - Sadness/Depression with empathetic support
  - Anger/Frustration with validation techniques
  - Stress/Overwhelm with coping strategies
  - Happiness/Joy with celebration and exploration
  - Confusion/Uncertainty with clarifying questions
- Topic detection (work, relationships, health, finances, etc.)

### 🤖 Contextual AI Response System
- Advanced conversation memory and follow-up awareness
- Personalized response generation based on:
  - Detected emotion + intensity + confidence
  - Specific topics mentioned (work, relationships, health, etc.)
  - User's actual words and conversational context
  - Previous conversation history
- Cultural sensitivity for different languages
- Speech synthesis of AI responses in user's selected language
- Intelligent follow-up questions and responses

### 🧘 Interactive Wellness Strategies & Tools
- **Guided Breathing Exercises**: 4-7-8 breathing technique with voice guidance
- **5-Minute Guided Meditation**: Complete meditation session with voice instructions
- **Progressive Muscle Relaxation**: Voice-guided muscle tension and release exercises
- **Gratitude Practice**: Interactive gratitude journal session
- **Grounding Techniques**: 5-4-3-2-1 sensory grounding exercise

### 📝 Personal Mood Tracking & Journaling
- **Quick Mood Check**: Daily mood, energy, and stress level tracking
- **Mood Journal**: Private journaling with mood tagging and emotional insights
- **Weekly Averages**: Track your emotional patterns over time
- **Auto-tagging**: Intelligent categorization of journal entries
- **Local Storage**: All data stays on your device for complete privacy

### 🎨 Modern & Accessible UI/UX Design
- Beautiful gradient design with calming blue-to-purple color scheme
- Card-based layout with smooth hover effects and shadows
- Smooth animations and transitions throughout
- Fully responsive design for all screen sizes
- Accessibility features with proper focus states and ARIA labels
- Dark/Light mode support with semantic color tokens

### 🆘 Mental Health Resources & Support
- Verified helpline numbers:
  - National Mental Health Programme: 1800-599-0019
  - NIMHANS Helpline: 080-46110007
  - Sneha India: 044-24640050
- Direct calling functionality from the app
- Professional disclaimer about not replacing medical advice
- Crisis support information and resources

### 🔒 Privacy-First & Security
- 100% anonymous usage - absolutely no data collection
- Complete local processing - all analysis happens in browser
- No server storage of conversations or personal data
- Local storage for mood tracking (stays on your device)
- Clear privacy messaging throughout the UI
- No external API calls for emotional analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hearmeout.git
cd hearmeout
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🏗️ Tech Stack

### Frontend Framework & Core
- **React 18**: Modern React with functional components and hooks
- **TypeScript 5**: Full type safety and enhanced developer experience
- **Vite 5**: Lightning-fast build tool and development server

### Styling & UI Components
- **Tailwind CSS 3**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible, unstyled UI primitives for consistent design
- **Lucide React**: Beautiful, customizable icons
- **shadcn/ui**: Pre-built, customizable component library

### State Management & Data
- **React Context API**: Global state management for voice and app state
- **React Query (TanStack Query)**: Server state management and caching
- **Local Storage**: Privacy-first data persistence for mood tracking

### Audio & Speech APIs
- **Web Speech API**: Browser-native speech recognition
- **SpeechSynthesis API**: Text-to-speech for AI response playback
- **Web Audio API**: Real-time audio level monitoring and waveform visualization

### Development & Build Tools
- **ESLint**: Code linting and quality enforcement
- **PostCSS**: CSS processing and optimization
- **React Router DOM**: Client-side routing and navigation

### Deployment & Hosting
- **Lovable Platform**: Integrated development and deployment platform
- **Browser Compatibility**: Chrome 25+, Firefox 44+, Safari 14.1+, Edge 79+

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Language selector, branding
│   ├── VoiceInterface.tsx      # Voice recording & transcription
│   ├── EmotionDisplay.tsx      # Emotion analysis & visualization
│   ├── AIResponse.tsx          # Contextual AI responses with playback
│   ├── CopingStrategies.tsx    # Interactive wellness tools
│   ├── MoodJournal.tsx         # Private mood journaling system
│   ├── QuickMoodCheck.tsx      # Daily mood & energy tracking
│   ├── Footer.tsx              # Resources, helplines, disclaimer
│   └── ui/                     # Reusable shadcn/ui components
├── context/
│   └── VoiceContext.tsx        # Global state management, AI logic
├── hooks/                      # Custom React hooks (useToast, etc.)
├── lib/                        # Utility functions and helpers
├── pages/                      # Route pages
│   ├── Index.tsx               # Main app page (currently fallback)
│   └── NotFound.tsx            # 404 error page
├── index.css                   # Global styles & design system tokens
├── App.tsx                     # Main application component & routing
└── main.tsx                    # Application entry point
```

## 🌐 Browser Compatibility & Requirements

### Supported Browsers
- **Chrome 25+** (Recommended - Full feature support)
- **Firefox 44+** (Full support with some speech API limitations)
- **Safari 14.1+** (Good support, may require permissions)
- **Edge 79+** (Full support)

### Required Browser Features
- **Web Speech API**: For voice recognition (requires HTTPS in production)
- **SpeechSynthesis API**: For AI response playback
- **Web Audio API**: For audio level monitoring and waveform visualization
- **Local Storage**: For mood tracking and journal entries
- **Media Devices API**: For microphone access

### Performance Requirements
- **JavaScript**: ES6+ support required
- **Memory**: Minimum 4GB RAM recommended for smooth operation
- **Network**: Internet connection required for initial load only
- **Microphone**: Required for voice interaction features

**Note**: All speech recognition and emotion analysis happens locally in the browser - no data is sent to external servers.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Disclaimer

**HearMeOut is designed to provide emotional support and wellness tools for general wellbeing.** 

### Medical Disclaimer
- This application is **NOT a substitute** for professional medical advice, diagnosis, or treatment
- Always seek the advice of qualified mental health professionals for clinical concerns
- Never disregard professional medical advice because of something you have experienced in this app

### Crisis Support
If you are experiencing severe mental health issues, thoughts of self-harm, or are in crisis:
- **Emergency Services**: Call your local emergency number immediately
- **Crisis Hotlines**: Use the helpline numbers provided in the app
- **Professional Help**: Contact a licensed mental health professional

### Data & Privacy
- All data processing happens locally in your browser
- No personal information is stored on external servers
- Your conversations and mood data remain completely private
- Clear your browser data to remove all local app data

## 🙏 Acknowledgments

- Web Speech API for voice recognition capabilities
- React and the amazing open-source community
- Mental health organizations for guidance on best practices
- All contributors who help make mental health support more accessible

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact us at support@hearmeout.com

---

Made with ❤️ for mental health awareness and support