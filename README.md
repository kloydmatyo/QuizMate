# Quiz Generation System

A powerful quiz generation system built with Next.js, Tailwind CSS, and MongoDB. Users can create, review, edit, and export quizzes with secure authentication and data handling.

## Features

### 🔐 User Authentication & Authorization
- Secure login and registration forms
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and security standards

### 📝 Quiz Management System
- **CRUD Operations for Quizzes**: Create, read, update, and delete quizzes
- **CRUD Operations for Questions**: Add, edit, and remove questions from quizzes
- **Question Types**: Multiple choice questions with 2-6 answer options
- **Quiz Organization**: Title, description, and creation timestamps

### 💾 Database Integration
- MongoDB integration with Mongoose ODM
- Secure data storage for users, quizzes, questions, and results
- Proper error handling and validation
- Environment variable configuration for sensitive data

### 🎨 Modern UI/UX Design
- **Color Palette**:
  - Primary: #4F46E5 (Indigo) - Buttons, Links, Active States
  - Secondary: #8B5CF6 (Violet) - Highlights, Secondary Actions
  - Accent: #34D399 (Emerald) - Success States, Call to Action
  - Background: #0F172A (Slate) - Backgrounds and Cards
- **Typography**: Inter font for modern, clean appearance
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 📤 Export Functionality
- Export quizzes in CSV format
- Export quizzes in JSON format
- Downloadable files with proper formatting

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **UI Icons**: Lucide React
- **Export**: CSV and JSON formats

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.local` file and update the values:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/quiz-generator
   # or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/quiz-generator

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000

   # App
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get JWT token
- `POST /api/auth/logout` - Logout user

### Quizzes
- `GET /api/quizzes` - Get all user's quizzes
- `POST /api/quizzes` - Create a new quiz
- `GET /api/quizzes/[id]` - Get specific quiz with questions
- `PUT /api/quizzes/[id]` - Update quiz details
- `DELETE /api/quizzes/[id]` - Delete quiz and all questions
- `GET /api/quizzes/[id]/export?format=csv|json` - Export quiz

### Questions
- `POST /api/questions` - Add question to quiz
- `GET /api/questions/[quizId]` - Get all questions for a quiz
- `PUT /api/questions/[quizId]/[id]` - Update specific question
- `DELETE /api/questions/[quizId]/[id]` - Delete specific question

## Usage

### Creating Your First Quiz

1. **Register/Login**: Create an account or sign in
2. **Create Quiz**: Click "Create New Quiz" and add title/description
3. **Add Questions**: Click "Add Question" to create multiple choice questions
4. **Edit Questions**: Use the edit button to modify existing questions
5. **Export Quiz**: Use the export dropdown to download in CSV or JSON format

### Question Format

Questions support:
- Question text (up to 500 characters)
- 2-6 multiple choice answers
- One correct answer selection
- Edit and delete functionality

### Export Formats

**CSV Format**: Includes question text, all answer choices, and correct answer index
**JSON Format**: Complete quiz data including metadata and questions

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- Environment variable configuration
- CORS protection

## Development

### Project Structure
```
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
├── components/        # React components
├── contexts/          # React contexts
├── lib/              # Utility functions
├── models/           # Database models
└── types/            # TypeScript definitions
```

### Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
