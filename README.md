# LCP PISO NET Attendance System

A gamified attendance system built with Next.js, TypeScript, and TailwindCSS. Players can check in daily, earn rewards, and compete on leaderboards.

## Features

### 👥 Player Features
- **Registration & Login**: Secure authentication with username/password
- **Daily Check-in**: Use 4-digit pincode for daily attendance
- **Leaderboard**: View top 5 players by attendance
- **Rewards**: View and redeem available rewards
- **Social Media**: Add and edit social media links
- **Dashboard**: Comprehensive player dashboard with stats

### 🛠️ Admin Features
- **Admin Login**: Fixed credentials (admin/admin)
- **Player Management**: View all players and their attendance
- **Reward Management**: Add, edit, and delete rewards
- **Leaderboard**: Full leaderboard with all players
- **Attendance Control**: Reset player attendance
- **Social Media Verification**: View player social media profiles

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Database**: In-memory JSON (for demo purposes)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd daily-redeem-attendance
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin`

**Demo Player:**
- Username: `kenth`
- Password: `12345`
- Pincode: `4321`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── login/             # Player login
│   ├── register/          # Player registration
│   ├── dashboard/         # Player dashboard
│   └── admin/             # Admin pages
│       ├── page.tsx       # Admin login
│       ├── dashboard/     # Admin dashboard
│       └── rewards/       # Reward management
├── components/            # Reusable components
│   ├── Leaderboard.tsx   # Leaderboard component
│   └── RewardCard.tsx    # Reward display component
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   └── database.ts       # Database operations
└── types/                 # TypeScript type definitions
    └── index.ts          # Type definitions
```

## Key Features Explained

### Daily Attendance System
- Players can check in once per day using their 4-digit pincode
- System prevents duplicate check-ins on the same day
- Attendance count is automatically incremented

### Reward System
- Admin can create rewards with required attendance days and redeem dates
- Players can only redeem rewards on the specified date if they meet requirements
- Rewards can be marked as claimed by admin

### Leaderboard
- Automatically ranks players by total attendance days
- Shows top 5 players on player dashboard
- Full leaderboard available on admin dashboard

### Social Media Integration
- Players can add Facebook, Instagram, and TikTok links
- Admin can view these links for verification purposes
- Links are displayed as clickable icons

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

The app is configured for Vercel deployment with `vercel.json`.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Database

Currently uses an in-memory JSON database for demo purposes. In production, you would want to replace this with:
- PostgreSQL
- MongoDB
- Supabase
- Firebase

## Customization

### Adding New Reward Types
Edit the `Reward` interface in `src/types/index.ts` and update the reward management components.

### Styling
The app uses TailwindCSS with custom color schemes. Modify `tailwind.config.ts` to change the design system.

### Authentication
The current authentication is basic. For production, consider implementing:
- JWT tokens
- Session management
- Password hashing
- OAuth integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please open an issue in the repository.
