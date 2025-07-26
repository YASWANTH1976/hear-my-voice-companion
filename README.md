# HearMeOut - AI Mental Health Companion

![HearMeOut](https://img.shields.io/badge/HearMeOut-AI%20Mental%20Health%20Companion-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=flat&logo=tailwindcss)

A production-ready, multilingual AI-powered mental health companion that provides real-time voice-based emotional support with personalized responses and interactive coping strategies.

## 🌟 Features

### 🎤 Voice Interface & Recognition
- Real-time voice recognition using Web Speech API
- Live transcription display with visual feedback
- Animated waveform visualization during recording
- Language-specific speech recognition for 10+ languages
- Visual recording states with color-coded feedback

### 🌍 Multilingual Support
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

### 🧠 Advanced Emotion Detection
- Contextual emotion analysis beyond simple keyword matching
- Intensity levels: low, medium, high
- Confidence scoring with visual progress bars
- Multiple emotion categories:
  - Anxiety/Fear
  - Sadness/Depression
  - Anger/Frustration
  - Stress/Overwhelm
  - Happiness/Joy
  - Confusion/Uncertainty

### 🤖 Intelligent AI Response System
- Context-aware responses that analyze specific topics
- Personalized response generation based on:
  - Detected emotion + intensity
  - Specific concerns mentioned (work, relationships, health, etc.)
  - User's actual words and context
- Cultural sensitivity for different languages
- Speech synthesis of AI responses in user's selected language

### 🧘 Interactive Wellness Strategies
- **Guided Breathing Exercises**: 4-7-8 breathing technique with voice guidance
- **5-Minute Guided Meditation**: Complete meditation session with voice instructions
- **Progressive Muscle Relaxation**: Voice-guided muscle tension and release exercises
- **Gratitude Practice**: Interactive gratitude journal session
- **Grounding Techniques**: 5-4-3-2-1 sensory grounding exercise

### 🎨 Professional UI/UX Design
- Modern gradient design with blue-to-purple color scheme
- Card-based layout with rounded corners and shadows
- Smooth animations and transitions throughout
- Responsive design for all screen sizes
- Accessibility features with proper focus states

### 🆘 Mental Health Resources
- Verified helpline numbers:
  - National Mental Health Programme: 1800-599-0019
  - NIMHANS Helpline: 080-46110007
  - Sneha India: 044-24640050
- Direct calling functionality
- Professional disclaimer about not replacing medical advice

### 🔒 Privacy & Security
- 100% anonymous usage - no data collection
- Local processing - all analysis happens in browser
- No server storage of conversations
- Clear privacy messaging in UI

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

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Speech Recognition**: Web Speech API
- **Speech Synthesis**: speechSynthesis API

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Language selector, branding
│   ├── VoiceInterface.tsx      # Recording, transcription
│   ├── EmotionDisplay.tsx      # Emotion analysis results
│   ├── AIResponse.tsx          # Contextual AI responses
│   ├── CopingStrategies.tsx    # Interactive wellness tools
│   ├── Footer.tsx              # Resources, disclaimer
│   └── ui/                     # Reusable UI components
├── context/
│   └── VoiceContext.tsx        # State management, AI logic
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
└── App.tsx                     # Main application component
```

## 🌐 Browser Support

- Chrome 25+
- Firefox 44+
- Safari 14.1+
- Edge 79+

**Note**: Speech recognition requires HTTPS in production and may have varying support across browsers.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

HearMeOut is designed to provide emotional support and wellness tools. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing severe mental health issues or are in crisis, please contact emergency services or a mental health professional immediately.

## 🙏 Acknowledgments

- Web Speech API for voice recognition capabilities
- React and the amazing open-source community
- Mental health organizations for guidance on best practices
- All contributors who help make mental health support more accessible

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact us at support@hearmeout.com

---

Made with ❤️ for mental health awareness and support