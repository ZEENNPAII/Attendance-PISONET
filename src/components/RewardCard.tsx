'use client';

import { Gift, Calendar, Users, CheckCircle } from 'lucide-react';
import { Reward } from '@/types';

interface RewardCardProps {
  reward: Reward;
  playerAttendanceDays: number;
  onRedeem?: (rewardId: string) => void;
  showRedeemButton?: boolean;
}

export default function RewardCard({ 
  reward, 
  playerAttendanceDays, 
  onRedeem, 
  showRedeemButton = true 
}: RewardCardProps) {
  const canRedeem = playerAttendanceDays >= reward.requiredDays;
  const today = new Date().toISOString().split('T')[0];
  const isRedeemDate = reward.redeemDate === today;
  const canRedeemToday = canRedeem && isRedeemDate && !reward.claimed;

  const handleRedeem = () => {
    if (onRedeem && canRedeemToday) {
      onRedeem(reward.id);
    }
  };

  return (
    <div className={`card ${reward.claimed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-success-600" />
          <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
        </div>
        {reward.claimed && (
          <CheckCircle className="h-5 w-5 text-success-600" />
        )}
      </div>

      <p className="text-gray-600 mb-4">{reward.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Requires {reward.requiredDays} attendance days
          </span>
          <span className={`badge ${canRedeem ? 'badge-success' : 'badge-warning'}`}>
            {playerAttendanceDays}/{reward.requiredDays}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Redeemable on {new Date(reward.redeemDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {showRedeemButton && (
        <div className="pt-3 border-t">
          {reward.claimed ? (
            <div className="text-center">
              <span className="badge badge-success">Claimed ✅</span>
            </div>
          ) : canRedeemToday ? (
            <button
              onClick={handleRedeem}
              className="w-full btn-success"
            >
              Redeem Now
            </button>
          ) : canRedeem ? (
            <div className="text-center">
              <span className="badge badge-warning">
                Available on {new Date(reward.redeemDate).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div className="text-center">
              <span className="badge badge-primary">
                Need {reward.requiredDays - playerAttendanceDays} more days
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
