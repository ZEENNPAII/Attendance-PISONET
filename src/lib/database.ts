import { Database, Player, Reward } from '@/types';

// API-based database functions
const API_BASE = '/api/database';

// Helper function to make API calls
const apiCall = async (action: string, params: any = {}) => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Load database from API
const loadDatabase = async () => {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to load database');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading database:', error);
    return {
      players: [],
      rewards: [],
      admin: { username: 'ssenpaii21', password: 'admin123' }
    };
  }
};

// Player management functions
export const getPlayers = async (): Promise<Player[]> => {
  try {
    const data = await loadDatabase();
    return data.players.filter((player: Player) => !player.deleted);
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

export const getPlayerByUsername = async (username: string): Promise<Player | undefined> => {
  try {
    const data = await loadDatabase();
    return data.players.find((player: Player) => player.username === username);
  } catch (error) {
    console.error('Error getting player:', error);
    return undefined;
  }
};

export const addPlayer = async (player: Omit<Player, 'attendanceDays' | 'lastCheckIn'>): Promise<boolean> => {
  try {
    await apiCall('addPlayer', player);
    return true;
  } catch (error) {
    console.error('Error adding player:', error);
    return false;
  }
};

export const updatePlayer = async (username: string, updates: Partial<Player>): Promise<boolean> => {
  try {
    await apiCall('updatePlayer', { username, ...updates });
    return true;
  } catch (error) {
    console.error('Error updating player:', error);
    return false;
  }
};

// Soft delete player (mark as deleted but keep in database)
export const softDeletePlayer = async (username: string): Promise<boolean> => {
  try {
    await apiCall('softDeletePlayer', { username });
    return true;
  } catch (error) {
    console.error('Error soft deleting player:', error);
    return false;
  }
};

// Restore soft-deleted player
export const restorePlayer = async (username: string): Promise<boolean> => {
  try {
    await apiCall('restorePlayer', { username });
    return true;
  } catch (error) {
    console.error('Error restoring player:', error);
    return false;
  }
};

// Update player password and pincode
export const updatePlayerCredentials = async (username: string, password: string, pincode: string): Promise<boolean> => {
  try {
    await apiCall('updatePlayer', { username, password, pincode });
    return true;
  } catch (error) {
    console.error('Error updating player credentials:', error);
    return false;
  }
};

// Get soft-deleted players for history
export const getDeletedPlayers = async (): Promise<Player[]> => {
  try {
    const data = await loadDatabase();
    return data.players.filter((player: Player) => player.deleted);
  } catch (error) {
    console.error('Error getting deleted players:', error);
    return [];
  }
};

export const checkInPlayer = async (username: string, pincode: string): Promise<{ success: boolean; message: string }> => {
  try {
    const player = await getPlayerByUsername(username);
    if (!player) {
      return { success: false, message: "Player not found" };
    }

    if (player.pincode !== pincode) {
      return { success: false, message: "Invalid pincode" };
    }

    const today = new Date().toISOString().split('T')[0];
    if (player.lastCheckIn === today) {
      return { success: false, message: "Already checked in today" };
    }

    const success = await updatePlayer(username, {
      attendanceDays: player.attendanceDays + 1,
      lastCheckIn: today
    });

    if (success) {
      return { success: true, message: "Successfully checked in!" };
    } else {
      return { success: false, message: "Failed to update attendance" };
    }
  } catch (error) {
    console.error('Error checking in player:', error);
    return { success: false, message: "Error checking in player" };
  }
};

// Reward management functions
export const getRewards = async (): Promise<Reward[]> => {
  try {
    const data = await loadDatabase();
    return data.rewards;
  } catch (error) {
    console.error('Error getting rewards:', error);
    return [];
  }
};

export const addReward = async (reward: Omit<Reward, 'id'>): Promise<boolean> => {
  try {
    await apiCall('addReward', reward);
    return true;
  } catch (error) {
    console.error('Error adding reward:', error);
    return false;
  }
};

export const updateReward = async (id: string, updates: Partial<Reward>): Promise<boolean> => {
  try {
    await apiCall('updateReward', { id, ...updates });
    return true;
  } catch (error) {
    console.error('Error updating reward:', error);
    return false;
  }
};

export const deleteReward = async (id: string): Promise<boolean> => {
  try {
    await apiCall('deleteReward', { id });
    return true;
  } catch (error) {
    console.error('Error deleting reward:', error);
    return false;
  }
};

// Leaderboard functions
export const getLeaderboard = async (limit?: number): Promise<Player[]> => {
  try {
    const data = await loadDatabase();
    const sortedPlayers = [...data.players]
      .filter((player: Player) => !player.deleted)
      .sort((a, b) => b.attendanceDays - a.attendanceDays);
    return limit ? sortedPlayers.slice(0, limit) : sortedPlayers;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

// Authentication functions
export const authenticatePlayer = async (username: string, password: string): Promise<boolean> => {
  try {
    const player = await getPlayerByUsername(username);
    return player ? player.password === password : false;
  } catch (error) {
    console.error('Error authenticating player:', error);
    return false;
  }
};

export const authenticateAdmin = (username: string, password: string): boolean => {
  return username === 'ssenpaii21' && password === 'admin123';
};

// Utility functions
export const getAvailableRewards = async (playerAttendanceDays: number): Promise<Reward[]> => {
  try {
    const data = await loadDatabase();
    const today = new Date().toISOString().split('T')[0];
    return data.rewards.filter((reward: Reward) => 
      reward.requiredDays <= playerAttendanceDays && 
      reward.redeemDate === today &&
      !reward.claimed
    );
  } catch (error) {
    console.error('Error getting available rewards:', error);
    return [];
  }
};

export const canRedeemReward = async (playerAttendanceDays: number, rewardId: string): Promise<boolean> => {
  try {
    const data = await loadDatabase();
    const reward = data.rewards.find((r: Reward) => r.id === rewardId);
    if (!reward) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return reward.requiredDays <= playerAttendanceDays && 
           reward.redeemDate === today && 
           !reward.claimed;
  } catch (error) {
    console.error('Error checking reward redemption:', error);
    return false;
  }
};

export const redeemReward = async (rewardId: string): Promise<boolean> => {
  try {
    await apiCall('markRewardClaimed', { id: rewardId });
    return true;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return false;
  }
};

// Legacy function for backward compatibility
export const refreshDatabase = (): void => {
  // No longer needed with API-based approach
  console.log('refreshDatabase is deprecated - data is now loaded from API');
};