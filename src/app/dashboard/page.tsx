'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Trophy, 
  Gift, 
  Key, 
  LogOut, 
  User, 
  Facebook, 
  Instagram, 
  Music,
  Edit3,
  CheckCircle
} from 'lucide-react';
import { getCurrentUser, logout, isPlayer } from '@/lib/auth';
import { 
  getPlayerByUsername, 
  getLeaderboard, 
  getRewards, 
  checkInPlayer, 
  getAvailableRewards,
  redeemReward,
  updatePlayer
} from '@/lib/database';
import { Player, Reward } from '@/types';
import Leaderboard from '@/components/Leaderboard';
import RewardCard from '@/components/RewardCard';

export default function PlayerDashboard() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [pincode, setPincode] = useState('');
  const [checkInMessage, setCheckInMessage] = useState('');
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [socials, setSocials] = useState({ facebook: '', instagram: '', tiktok: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !isPlayer()) {
      router.push('/login');
      return;
    }

    const playerData = getPlayerByUsername(currentUser.username);
    if (!playerData) {
      router.push('/login');
      return;
    }

    setPlayer(playerData);
    setSocials(playerData.socials);
    setRewards(getRewards());
    setLeaderboard(getLeaderboard(5));
    setIsLoading(false);
  }, [router]);

  const handleCheckIn = () => {
    if (!player || !pincode) return;

    const result = checkInPlayer(player.username, pincode);
    setCheckInMessage(result.message);

    if (result.success) {
      // Refresh player data
      const updatedPlayer = getPlayerByUsername(player.username);
      if (updatedPlayer) {
        setPlayer(updatedPlayer);
        setLeaderboard(getLeaderboard(5));
      }
      setPincode('');
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    const success = redeemReward(rewardId);
    if (success) {
      setRewards(getRewards());
      setCheckInMessage('Reward redeemed successfully!');
    }
  };

  const handleUpdateSocials = () => {
    if (!player) return;

    const success = updatePlayer(player.username, { socials });
    if (success) {
      const updatedPlayer = getPlayerByUsername(player.username);
      if (updatedPlayer) {
        setPlayer(updatedPlayer);
      }
      setIsEditingSocials(false);
      setCheckInMessage('Social media links updated successfully!');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = player.lastCheckIn === today;
  const availableRewards = getAvailableRewards(player.attendanceDays);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Player Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {player.username}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Check-in Message */}
        {checkInMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            checkInMessage.includes('Success') || checkInMessage.includes('redeemed') 
              ? 'bg-success-50 border border-success-200 text-success-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {checkInMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Check-in & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Check-in */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Daily Check-in</h2>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600 mb-2">
                    {player.attendanceDays}
                  </p>
                  <p className="text-gray-600">Total Attendance Days</p>
                </div>
              </div>

              {hasCheckedInToday ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-success-600 mx-auto mb-2" />
                  <p className="text-success-600 font-medium">Already checked in today!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Come back tomorrow for your next check-in
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your 4-digit pincode
                    </label>
                    <div className="relative">
                      <input
                        id="pincode"
                        type="password"
                        maxLength={4}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="input-field text-center text-2xl tracking-widest"
                        placeholder="1234"
                      />
                      <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <button
                    onClick={handleCheckIn}
                    disabled={pincode.length !== 4}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check In Today
                  </button>
                </div>
              )}
            </div>

            {/* Available Rewards */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="h-5 w-5 text-success-600" />
                <h2 className="text-xl font-semibold text-gray-900">Available Rewards</h2>
              </div>
              
              {availableRewards.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {availableRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      playerAttendanceDays={player.attendanceDays}
                      onRedeem={handleRedeemReward}
                    />
                  ))}
                </div>
              ) : (
                <div className="card text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No rewards available for redemption today</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Keep checking in to unlock more rewards!
                  </p>
                </div>
              )}
            </div>

            {/* All Rewards */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Rewards</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    playerAttendanceDays={player.attendanceDays}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard & Social Links */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Leaderboard players={leaderboard} limit={5} />

            {/* Social Media Links */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>
                <button
                  onClick={() => setIsEditingSocials(!isEditingSocials)}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>

              {isEditingSocials ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={socials.facebook}
                      onChange={(e) => setSocials(prev => ({ ...prev, facebook: e.target.value }))}
                      className="input-field"
                      placeholder="https://facebook.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={socials.instagram}
                      onChange={(e) => setSocials(prev => ({ ...prev, instagram: e.target.value }))}
                      className="input-field"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TikTok
                    </label>
                    <input
                      type="url"
                      value={socials.tiktok}
                      onChange={(e) => setSocials(prev => ({ ...prev, tiktok: e.target.value }))}
                      className="input-field"
                      placeholder="https://tiktok.com/@yourprofile"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateSocials}
                      className="btn-primary flex-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingSocials(false);
                        setSocials(player.socials);
                      }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-sm">Facebook Profile</span>
                    </a>
                  )}
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram Profile</span>
                    </a>
                  )}
                  {socials.tiktok && (
                    <a
                      href={socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-800 hover:text-gray-900"
                    >
                      <Music className="h-4 w-4" />
                      <span className="text-sm">TikTok Profile</span>
                    </a>
                  )}
                  {!socials.facebook && !socials.instagram && !socials.tiktok && (
                    <p className="text-gray-500 text-sm">No social media links added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
