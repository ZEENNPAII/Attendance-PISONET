'use client';

import { Trophy, Medal, Award } from 'lucide-react';
import { Player } from '@/types';

interface LeaderboardProps {
  players: Player[];
  limit?: number;
  showRank?: boolean;
}

export default function Leaderboard({ players, limit, showRank = true }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-gray-500">#{index + 1}</span>;
    }
  };

  const displayPlayers = limit ? players.slice(0, limit) : players;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {limit ? `Top ${limit} Players` : 'Leaderboard'}
      </h3>
      
      {displayPlayers.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No players yet</p>
      ) : (
        <div className="space-y-3">
          {displayPlayers.map((player, index) => (
            <div
              key={player.username}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {showRank && (
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{player.username}</p>
                  <p className="text-sm text-gray-500">
                    Last check-in: {player.lastCheckIn || 'Never'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600">
                  {player.attendanceDays}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
