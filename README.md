# QuizMate - Quiz Generation System

A comprehensive quiz generation system built with Next.js, Tailwind CSS, and MongoDB. This application allows both learners and instructors to register, authenticate, and create, review, edit, and export quizzes.

## Features

### Authentication & Authorization
- User registration and login for learners and instructors
- Secure password hashing with bcrypt
- JWT-based authentication
- Input validation and error handling

### Quiz Management
- Create, read, update, and delete quizzes
- Add, edit, and delete questions with multiple choice answers
- Export quizzes to PDF format
- Professional UI with responsive design

### Security Features
- Password strength validation
- JWT token-based authentication
- Protected API routes
- Input sanitization and validation

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety and better development experience

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification

### Additional Libraries
- **jsPDF** - PDF generation for quiz exports

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally, or MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quiz-system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For New Users
1. Click "Sign up" to create a new account
2. Choose your role (Learner or Instructor)
3. Fill in your email, username, and password
4. Click "Sign up" to register

### For Existing Users
1. Enter your email and password
2. Click "Sign in" to log in

### Creating Quizzes
1. After logging in, click "Create New Quiz"
2. Enter a title and optional description
3. Click "Create Quiz"

### Managing Questions
1. Click "Questions" on any quiz card
2. Click "Add Question" to create new questions
3. Enter question text and multiple choice answers
4. Select the correct answer by clicking the radio button
5. Add or remove answer choices as needed (2-6 choices allowed)

### Exporting Quizzes
1. Navigate to the questions page of any quiz
2. Click "Export PDF" to download a PDF version of the quiz

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user

### Quizzes
- `GET /api/quizzes` - Get all quizzes for authenticated user
- `POST /api/quizzes` - Create a new quiz
- `GET /api/quizzes/[id]` - Get specific quiz
- `PUT /api/quizzes/[id]` - Update quiz
- `DELETE /api/quizzes/[id]` - Delete quiz

### Questions
- `POST /api/questions` - Create a new question
- `GET /api/questions/quiz/[quizId]` - Get all questions for a quiz
- `PUT /api/questions/[id]` - Update question
- `DELETE /api/questions/[id]` - Delete question

## Database Schema

### Users Collection
```javascript
{
  email: String (required, unique),
  username: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['learner', 'instructor']),
  createdAt: Date
}
```

### Quizzes Collection
```javascript
{
  title: String (required),
  description: String,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Questions Collection
```javascript
{
  questionText: String (required),
  answerChoices: [String] (2-6 choices),
  correctAnswer: Number (index of correct choice),
  quizId: ObjectId (ref: Quiz),
  createdAt: Date
}
```

## Color Palette

- **Primary**: #4F46E5 (Indigo) - Buttons, Links, Active States
- **Secondary**: #8B5CF6 (Violet) - Highlights, Secondary Actions
- **Accent**: #34D399 (Emerald) - Call to Action, Success States
- **Background**: #0F172A (Slate) - Backgrounds and Cards
- **Text**: Black - Primary Text

## Security Considerations

- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens expire after 7 days
- API routes are protected with middleware
- Input validation on both client and server side
- Environment variables for sensitive data

## Development

### Project Structure
```
src/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── contexts/         # React contexts
├── lib/             # Utility functions
├── models/          # Database models
└── types/           # TypeScript type definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.