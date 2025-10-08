'use client';

import Link from 'next/link';
import { Trophy, Users, Gift, Calendar } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Daily Redeem</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="btn-primary">
                Player Login
              </Link>
              <Link href="/admin" className="btn-secondary">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Daily Redeem
            <span className="text-primary-600"> Attendance System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our gamified attendance system! Check in daily, earn rewards, and compete on the leaderboard. 
            The more you attend, the better rewards you can redeem!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started - Register Now
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Already a Player? Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="card text-center">
            <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Check-in</h3>
            <p className="text-gray-600">
              Check in daily with your 4-digit pincode to build your attendance streak.
            </p>
          </div>

          <div className="card text-center">
            <Trophy className="h-12 w-12 text-warning-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <p className="text-gray-600">
              Compete with other players and see who has the highest attendance record.
            </p>
          </div>

          <div className="card text-center">
            <Gift className="h-12 w-12 text-success-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rewards</h3>
            <p className="text-gray-600">
              Earn amazing rewards like rice, groceries, and more based on your attendance.
            </p>
          </div>

          <div className="card text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Connect with other players and share your social media profiles.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register & Login</h3>
              <p className="text-gray-600">
                Create your account with username, password, and a 4-digit pincode for daily check-ins.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Check-in</h3>
              <p className="text-gray-600">
                Visit your dashboard daily and check in using your pincode to build your attendance streak.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn & Redeem</h3>
              <p className="text-gray-600">
                Accumulate attendance days to unlock rewards and redeem them on special dates.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Daily Redeem Attendance System. Built with Next.js & TailwindCSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
