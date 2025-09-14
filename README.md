# Synthra - AI Music Generation Platform

Synthra is a web application that generates AI-powered music with real-time visualizations. Features React frontend with Framer Motion animations and Flask backend integrated with Suno API.

## Quick Setup

### Prerequisites
- Python 3.8+, Node.js 16+, Suno API key, OpenAI API key

### 1. Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install flask flask-cors requests python-dotenv openai
```

Create `.env` file:
```env
SUNO_BASE_URL=your_suno_base_url
SUNO_API_KEY=your_suno_api_key
OPENAI_API_KEY=your_openai_api_key
```

```bash
python run.py  # Runs on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd client
npm install
npm install framer-motion
npm install hydra-synth
npm run dev  # Runs on http://localhost:5173
```

## Features

- **AI Music Generation**: Stylized instrumental music from text/speech descriptions
- **Real-time Visualizations**: Procedurally generated Hydra patterns visuals
- **AI DJ Chat**: Conversational interface with voice input/output
- **Interactive Controls**: Adjust visual parameters (pixelation, brightness, invert)
- **Smooth Animations**: Framer Motion-powered UI transitions

## Key Dependencies

**Backend**: `flask`, `flask-cors`, `requests`, `python-dotenv`, `openai` 
**Frontend**: `react`, `framer-motion`, `vite`, `hydra-synth`


## Project Structure
```
HackMIT25/
├── client/          # React frontend
├── server/          # Flask backend
└── README.md
```

## Usage

1. Start both servers (backend: port 5001, frontend: port 5173)
2. Navigate to `http://localhost:5173`
3. Chat with DJ Synthra or enter musical style descriptions
4. Generate instrumental music and adjust visual parameters
5. Songs auto-save for session persistence until discarded


## License

HackMIT 2025 project
