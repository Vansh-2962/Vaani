# Vaani — Real-Time Multilingual Speech-to-Text

Vaani is a web-based Speech-to-Text application that converts spoken words into text in real time. It supports multilingual transcription, including Hindi, English, and Hinglish, using Google's Gemini Live API.

The application provides a simple recording interface where users can capture their voice, view live transcriptions, and save, edit, or manage their transcription history.

## Features

- **Real-Time Speech-to-Text:** Convert speech into text while speaking.
- **Multilingual Support:** Supports Hindi, English, and Hinglish.
- **Live Recording:** Start and stop microphone recording directly from the browser.
- **Live Transcription:** Display recognized speech in the UI.
- **Transcription History:** View previously saved transcriptions.
- **CRUD Operations:** Create, read, update, and delete saved transcriptions.
- **Search & Filtering:** Find saved transcriptions using available history filters.
- **Responsive UI:** Clean dashboard interface for different screen sizes.
- **Secure API Key Handling:** Uses short-lived Gemini ephemeral tokens so the permanent API key stays on the backend.

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Router
- Lucide React
- Google GenAI SDK (`@google/genai`)

### Backend

- Node.js
- Express.js
- TypeScript
- Google GenAI SDK (`@google/genai`)
- REST APIs

### Database & ORM

- Neon PostgreSQL
- Drizzle ORM
- Drizzle Kit

### AI Integration

- Google Gemini Live API
- Gemini real-time transcription model
- Ephemeral authentication tokens
- Browser MediaStream API
- Web Audio API for microphone audio processing

## Architecture

```text
                 Vaani Application
                        |
             +----------+----------+
             |                     |
         Frontend                Backend
       React + Vite           Express + Node.js
             |                     |
       TanStack Query       REST API Endpoints
             |                     |
             |               +-----+------+
             |               |            |
             |          Neon DB       Gemini API
             |          (Drizzle)     (Token API)
             |                            |
             +------ Ephemeral Token -----+
             |
        Gemini Live SDK
             |
       Microphone Audio
             |
      Live Transcription
             |
        Display Text
```

## How It Works

1. The user clicks the Start Recording button.
2. The frontend requests an ephemeral token from the backend.
3. The backend generates a short-lived token using the Gemini API.
4. The frontend initializes a Gemini Live session using the token.
5. The browser captures microphone audio.
6. Audio is streamed to Gemini Live for speech recognition.
7. Gemini returns transcription updates.
8. The frontend displays the recognized text in real time.
9. The user can save the transcription to Neon PostgreSQL.
10. Saved transcriptions can be viewed, edited, and deleted from the history dashboard.

## Project Structure

```text
procucev-assignment/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
└── README.md
```

_The structure above represents the main application areas; individual filenames may vary._

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- Google Gemini API key
- Neon PostgreSQL database

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd procucev-assignment
```

### 2. Setup Backend

```bash
cd backend
pnpm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_neon_database_url
```

Push the database schema:

```bash
pnpm db:push
```

Start the backend:

```bash
pnpm dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
pnpm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
pnpm dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/api/gemini/token`       | Generate Gemini ephemeral token |
| GET    | `/api/transcriptions`     | Fetch all transcriptions        |
| GET    | `/api/transcriptions/:id` | Fetch a transcription           |
| POST   | `/api/transcriptions`     | Save a transcription            |
| PATCH  | `/api/transcriptions/:id` | Update a transcription          |
| DELETE | `/api/transcriptions/:id` | Delete a transcription          |

## Development & AI Assistance

This project was developed with a combination of hands-on implementation and AI-assisted development.

### Implemented and Integrated by Me

- Project setup and frontend/backend integration.
- Backend API integration with the React frontend.
- TanStack React Query configuration and data-fetching hooks.
- Integration of transcription history and CRUD operations.
- Google Gemini API integration and authentication flow.
- Browser microphone and real-time transcription workflow.
- Database configuration and application testing.
- Debugging and resolving integration and runtime issues.

### AI-Assisted Development (GitHub Copilot)

GitHub Copilot was used to accelerate development, particularly for:

- Initial dashboard UI and layout generation.
- Reusable frontend component scaffolding.
- Styling and responsive design implementation.
- Assistance with repetitive code and development tasks.

All generated code was reviewed, integrated, tested, and adapted as required for the application.

## Future Improvements

- Export transcriptions as TXT, PDF, or DOCX.
- Improve transcription accuracy and punctuation.
- Add support for more languages.
- Add user authentication and personal transcription workspaces.
- Improve audio processing using AudioWorklet.
- Add deployment and automated testing.

## Acknowledgements

- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [React](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)
- [GitHub Copilot](https://github.com/features/copilot)

---

**Built as part of the Procucev AI Tech Hiring Assignment.**
