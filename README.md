# Synthra - Music Generation Platform

Synthra is a web application that allows users to synthesize their musical and artistic visions using AI-powered music generation. The platform features a React frontend and a Flask backend that integrates with the Suno API for music generation.

## Project Structure

```
HackMIT25/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Flask backend
│   ├── app/
│   ├── services/
│   ├── requirements.txt
│   ├── run.py
│   └── config.py
└── README.md
```

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Suno API access (API key and base URL)

## Backend Setup (Flask Server)

### 1. Navigate to the server directory
```bash
cd server
```

### 2. Create a Python virtual environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the server directory and add your Suno API credentials:

```bash
# Create .env file
touch .env
```

Add the following content to the `.env` file:
```env
SUNO_BASE_URL=your_suno_base_url_here
SUNO_API_KEY=your_suno_api_key_here
```

Replace `your_suno_base_url_here` and `your_suno_api_key_here` with your actual Suno API credentials.

### 5. Run the Flask server
```bash
python run.py
```

The Flask server will start on `http://localhost:5001`

## Frontend Setup (React Client)

### 1. Navigate to the client directory
```bash
cd client
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The React application will start on `http://localhost:5173`

## API Dependencies

The Flask server uses the following main packages:

- **Flask** (3.1.2) - Web framework
- **flask-cors** (6.0.1) - Cross-Origin Resource Sharing support
- **requests** (2.32.5) - HTTP library for API calls
- **python-dotenv** - Environment variable management

## Features

- User authentication (login/signup)
- Music generation from text prompts
- Audio parameter adjustment
- User profile management
- Saved songs history

## Usage

1. Start both the Flask backend server and React frontend
2. Navigate to `http://localhost:5173`
3. Login or create an account
4. Describe your musical vision in the text input
5. Click "Visualize" to generate music
6. Adjust parameters on the parameters page
7. Save and manage your generated music

## Development Notes

- The backend runs on port 5001 to avoid conflicts with other services
- CORS is enabled for frontend-backend communication
- The Suno service handles music generation with polling for completion
- Audio files are streamed from the Suno API

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure flask-cors is installed and properly configured
2. **API key errors**: Verify your Suno API credentials in the `.env` file
3. **Port conflicts**: Make sure ports 5001 (backend) and 5173 (frontend) are available
4. **Virtual environment**: Always activate your Python virtual environment before running the server

### Error Messages

- `Error 401`: Check your Suno API key
- `Connection refused`: Ensure the Flask server is running on port 5001
- `Module not found`: Activate your virtual environment and reinstall dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is developed for HackMIT 2025.