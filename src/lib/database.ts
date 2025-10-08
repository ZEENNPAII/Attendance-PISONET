import { Database, Player, Reward } from '@/types';

// In-memory database (in production, this would be replaced with a real database)
let database: Database = {
  players: [
    {
      username: "kenth",
      password: "12345",
      pincode: "4321",
      attendanceDays: 23,
      lastCheckIn: "2025-10-08",
      socials: {
        facebook: "https://fb.com/kenth",
        instagram: "",
        tiktok: ""
      }
    }
  ],
  rewards: [
    {
      id: "1",
      name: "5 Kilo Rice",
      requiredDays: 20,
      redeemDate: "2025-12-25",
      description: "Redeemable this Christmas for active players."
    }
  ]
};

// Player management functions
export const getPlayers = (): Player[] => {
  return database.players;
};

export const getPlayerByUsername = (username: string): Player | undefined => {
  return database.players.find(player => player.username === username);
};

export const addPlayer = (player: Omit<Player, 'attendanceDays' | 'lastCheckIn'>): void => {
  const newPlayer: Player = {
    ...player,
    attendanceDays: 0,
    lastCheckIn: ""
  };
  database.players.push(newPlayer);
};

export const updatePlayer = (username: string, updates: Partial<Player>): boolean => {
  const playerIndex = database.players.findIndex(player => player.username === username);
  if (playerIndex === -1) return false;
  
  database.players[playerIndex] = { ...database.players[playerIndex], ...updates };
  return true;
};

export const checkInPlayer = (username: string, pincode: string): { success: boolean; message: string } => {
  const player = getPlayerByUsername(username);
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

  updatePlayer(username, {
    attendanceDays: player.attendanceDays + 1,
    lastCheckIn: today
  });

  return { success: true, message: "Successfully checked in!" };
};

// Reward management functions
export const getRewards = (): Reward[] => {
  return database.rewards;
};

export const addReward = (reward: Omit<Reward, 'id'>): void => {
  const newReward: Reward = {
    ...reward,
    id: Date.now().toString()
  };
  database.rewards.push(newReward);
};

export const updateReward = (id: string, updates: Partial<Reward>): boolean => {
  const rewardIndex = database.rewards.findIndex(reward => reward.id === id);
  if (rewardIndex === -1) return false;
  
  database.rewards[rewardIndex] = { ...database.rewards[rewardIndex], ...updates };
  return true;
};

export const deleteReward = (id: string): boolean => {
  const rewardIndex = database.rewards.findIndex(reward => reward.id === id);
  if (rewardIndex === -1) return false;
  
  database.rewards.splice(rewardIndex, 1);
  return true;
};

// Leaderboard functions
export const getLeaderboard = (limit?: number): Player[] => {
  const sortedPlayers = [...database.players].sort((a, b) => b.attendanceDays - a.attendanceDays);
  return limit ? sortedPlayers.slice(0, limit) : sortedPlayers;
};

// Authentication functions
export const authenticatePlayer = (username: string, password: string): boolean => {
  const player = getPlayerByUsername(username);
  return player ? player.password === password : false;
};

export const authenticateAdmin = (username: string, password: string): boolean => {
  return username === 'ssenpaii21' && password === 'admin123';
};

// Utility functions
export const getAvailableRewards = (playerAttendanceDays: number): Reward[] => {
  const today = new Date().toISOString().split('T')[0];
  return database.rewards.filter(reward => 
    reward.requiredDays <= playerAttendanceDays && 
    reward.redeemDate === today &&
    !reward.claimed
  );
};

export const canRedeemReward = (playerAttendanceDays: number, rewardId: string): boolean => {
  const reward = database.rewards.find(r => r.id === rewardId);
  if (!reward) return false;
  
  const today = new Date().toISOString().split('T')[0];
  return reward.requiredDays <= playerAttendanceDays && 
         reward.redeemDate === today && 
         !reward.claimed;
};

export const redeemReward = (rewardId: string): boolean => {
  return updateReward(rewardId, { claimed: true });
};
