# 🌙 MindWell – Mood & Journaling App

A simple, calming mood tracker and journaling app built to help you reflect, track emotions, and build better mental habits.

👉 **Live Demo:** https://mood-tracker-nine-black.vercel.app/

---

## ✨ What You Can Do

📝 **Daily Journal**
- Write and save your thoughts
- Simple and clean UI for focus
- View old entries anytime

😊 **Mood Tracker**
- Log your mood with emojis
- Add short notes with your mood
- View weekly mood trends

🫁 **Breathing Section**
- Simple guided breathing
- Helps to relax during stress
- Clean animations and minimal design

📊 **Stats & Insights**
- View mood patterns
- See emotional trends
- Track consistency streaks

🌙 **Dark Mode**
- Fully responsive  
- Works on mobile, tablet, PC  
- Eye-friendly dark theme  

---

## 🛠️ Built With

| Tech | Usage |
|------|------|
| ⚛️ React + Next.js | Frontend |
| 🎨 Tailwind CSS | Styling |
| 🍃 MongoDB | Database |
| 📈 Recharts | Graphs |
| 💠 Lucide React | Icons |
| 🌍 Vercel | Deployment |

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/nh7k/mood_tracker.git
cd mood_tracker
2. Install pnpm (if not installed)
npm install -g pnpm

3. Install Dependencies

Using npm:

npm install


Using pnpm:

pnpm install

4. Setup Environment Variables

Create a file named .env.local in the root directory:

MONGODB_URI=your_mongodb_connection_string

5. Run the App

Using npm:

npm run dev


Using pnpm:

pnpm dev


Then open:
👉 http://localhost:3000

📂 Project Structure
mindwell/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
├── public/
├── hooks/
├── styles/
└── next.config.mjs

🚀 Deployment

Deployed on Vercel
Live project:
👉 https://mood-tracker-nine-black.vercel.app/

Deployment steps:

Push code to GitHub

Go to https://vercel.com

Import your repository

Add environment variable:

MONGODB_URI

Click Deploy ✅

🎨 Icons Used

Icons are from lucide-react.

Example:

import { Moon, Smile, BookOpen } from "lucide-react"

<Moon size={20} />
<Smile size={20} />
<BookOpen size={20} />

🔧 Common Issues
MongoDB Not Connecting

Add your IP in MongoDB Atlas

Check .env.local file

Restart your server after setting env vars
