# Macro Tracker

An AI-powered macro nutrition tracker that analyzes food photos to automatically detect calories, protein, fats, and carbohydrates. Built with Next.js, PostgreSQL, and OpenAI Vision API.

![Macro Tracker](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-Vision%20API-412991?style=for-the-badge&logo=openai)

## 🚀 Live Demo

**Production**: [https://macro-tracker-el7pzg3di-alexs-projects-3c8ec3e1.vercel.app](https://macro-tracker-el7pzg3di-alexs-projects-3c8ec3e1.vercel.app)

## ✨ Features

- 📱 **AI Food Analysis**: Upload photos of food for automatic macro detection using OpenAI Vision API
- 🏠 **Interactive Dashboard**: Beautiful charts showing daily macro breakdown and summaries
- 📊 **Visual Analytics**: Pie charts and progress tracking for nutritional goals
- 📝 **Food Log**: Detailed history of all food entries with images and timestamps
- 👤 **User Authentication**: Secure JWT-based signup/login system
- 📱 **HEIC Support**: Full compatibility with iPhone photos (automatic conversion)
- 🎨 **Modern UI**: Clean, responsive design with emerald theme and excellent readability
- 🔒 **Data Privacy**: User data isolation - see only your own entries

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4 Vision API
- **Authentication**: JWT with bcryptjs
- **Charts**: Recharts
- **Images**: Next/Image with HEIC conversion (heic2any)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/DeProdigy/macro-tracker.git
   cd macro-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your values:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/macro_tracker"
   OPENAI_API_KEY="your-openai-api-key"
   JWT_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. **Sign up** for a new account or **log in**
2. **Add Food Entry**: Upload a photo of your meal
3. **AI Analysis**: The system automatically detects food items and estimates macros
4. **Review & Edit**: Adjust the detected values if needed
5. **Save**: Your entry is saved with the photo and nutritional data
6. **Track Progress**: View your daily summaries and macro breakdown

### Features Overview
- **Dashboard**: View today's macro summary with interactive charts
- **Add Food**: Take or upload photos for AI analysis
- **Food Log**: Browse your complete food history by date
- **Navigation**: Seamless switching between dashboard, add food, and log views

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for Vision API | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |

### Database Schema

The app uses Prisma with PostgreSQL. Key models:
- **User**: Authentication and user data
- **FoodEntry**: Food entries with nutritional data and image paths

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**
   - Import your repository on Vercel
   - Configure environment variables in the dashboard

2. **Set Environment Variables**
   - Add `DATABASE_URL`, `OPENAI_API_KEY`, and `JWT_SECRET`

3. **Deploy**
   - Vercel automatically builds and deploys on every push

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Project Structure

```
macro-tracker/
├── prisma/                 # Database schema and migrations
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── api/           # API routes
│   │   ├── add/           # Add food page
│   │   └── log/           # Food log page
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── uploads/              # Local file storage (gitignored)
└── public/              # Static assets
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the powerful Vision API
- Vercel for seamless deployment
- The Next.js team for the amazing framework
- All contributors and testers

## 📞 Support

If you have any questions or run into issues:
- Open an [issue](https://github.com/DeProdigy/macro-tracker/issues)
- Check the [documentation](https://github.com/DeProdigy/macro-tracker/wiki)

---

Built with ❤️ using Next.js and OpenAI Vision API

🤖 *Generated with [Claude Code](https://claude.ai/code)*
