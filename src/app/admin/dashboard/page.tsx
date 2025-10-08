'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  Trophy, 
  Gift, 
  LogOut, 
  Facebook, 
  Instagram, 
  Music,
  Calendar,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { getCurrentUser, logout, isAdmin } from '@/lib/auth';
import { 
  getPlayers, 
  getLeaderboard, 
  getRewards, 
  updatePlayer,
  redeemReward
} from '@/lib/database';
import { Player, Reward } from '@/types';
import Leaderboard from '@/components/Leaderboard';

export default function AdminDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !isAdmin()) {
      router.push('/admin');
      return;
    }

    loadData();
    setIsLoading(false);
  }, [router]);

  const loadData = () => {
    setPlayers(getPlayers());
    setRewards(getRewards());
    setLeaderboard(getLeaderboard());
  };

  const handleResetAttendance = (username: string) => {
    if (window.confirm(`Are you sure you want to reset ${username}&apos;s attendance?`)) {
      const success = updatePlayer(username, { attendanceDays: 0, lastCheckIn: '' });
      if (success) {
        loadData();
        setMessage(`${username}&apos;s attendance has been reset`);
      }
    }
  };

  const handleMarkRewardClaimed = (rewardId: string) => {
    const success = redeemReward(rewardId);
    if (success) {
      setRewards(getRewards());
      setMessage('Reward marked as claimed');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadData}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
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
        {/* Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-success-50 border border-success-200 text-success-700">
            {message}
            <button
              onClick={() => setMessage('')}
              className="ml-2 text-success-600 hover:text-success-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{players.length}</p>
            <p className="text-gray-600">Total Players</p>
          </div>
          <div className="card text-center">
            <Trophy className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {players.reduce((sum, player) => sum + player.attendanceDays, 0)}
            </p>
            <p className="text-gray-600">Total Check-ins</p>
          </div>
          <div className="card text-center">
            <Gift className="h-8 w-8 text-success-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{rewards.length}</p>
            <p className="text-gray-600">Active Rewards</p>
          </div>
          <div className="card text-center">
            <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {players.filter(p => p.lastCheckIn === new Date().toISOString().split('T')[0]).length}
            </p>
            <p className="text-gray-600">Today&apos;s Check-ins</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Players List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Players</h2>
                <Link
                  href="/admin/rewards"
                  className="btn-primary"
                >
                  Manage Rewards
                </Link>
              </div>

              {players.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No players registered yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Player
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Check-in
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Social Media
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {players.map((player) => (
                        <tr key={player.username}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {player.username}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-primary-600">
                              {player.attendanceDays} days
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {player.lastCheckIn || 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {player.socials.facebook && (
                                <a
                                  href={player.socials.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Facebook className="h-4 w-4" />
                                </a>
                              )}
                              {player.socials.instagram && (
                                <a
                                  href={player.socials.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-pink-600 hover:text-pink-700"
                                >
                                  <Instagram className="h-4 w-4" />
                                </a>
                              )}
                              {player.socials.tiktok && (
                                <a
                                  href={player.socials.tiktok}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-800 hover:text-gray-900"
                                >
                                  <Music className="h-4 w-4" />
                                </a>
                              )}
                              {!player.socials.facebook && !player.socials.instagram && !player.socials.tiktok && (
                                <span className="text-gray-400 text-xs">No links</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleResetAttendance(player.username)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Reset Attendance
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaderboard & Rewards */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Leaderboard players={leaderboard} showRank={true} />

            {/* Rewards Management */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rewards</h3>
              
              {rewards.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rewards configured</p>
              ) : (
                <div className="space-y-3">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{reward.name}</h4>
                          <p className="text-sm text-gray-600">{reward.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Requires: {reward.requiredDays} days</span>
                            <span>Date: {new Date(reward.redeemDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {reward.claimed ? (
                            <CheckCircle className="h-5 w-5 text-success-600" />
                          ) : (
                            <button
                              onClick={() => handleMarkRewardClaimed(reward.id)}
                              className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded"
                            >
                              Mark Claimed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/admin/rewards"
                  className="w-full btn-primary text-center block"
                >
                  Manage Rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
