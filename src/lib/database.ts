import { Database, Player, Reward } from '@/types';

// Default database data
const defaultDatabase: Database = {
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

// Load database from localStorage or use default
const loadDatabase = (): Database => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('attendance-database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading database from localStorage:', error);
      }
    }
  }
  return defaultDatabase;
};

// Save database to localStorage
const saveDatabase = (db: Database): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('attendance-database', JSON.stringify(db));
  }
};

// Initialize database with persistence
let database: Database = defaultDatabase;

// Load database from localStorage on client side
if (typeof window !== 'undefined') {
  database = loadDatabase();
}

// Function to refresh database from localStorage
export const refreshDatabase = (): void => {
  if (typeof window !== 'undefined') {
    database = loadDatabase();
  }
};

// Player management functions
export const getPlayers = (): Player[] => {
  // Refresh database from localStorage on each call
  if (typeof window !== 'undefined') {
    database = loadDatabase();
  }
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
  saveDatabase(database);
};

export const updatePlayer = (username: string, updates: Partial<Player>): boolean => {
  const playerIndex = database.players.findIndex(player => player.username === username);
  if (playerIndex === -1) return false;
  
  database.players[playerIndex] = { ...database.players[playerIndex], ...updates };
  saveDatabase(database);
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
  // Refresh database from localStorage on each call
  if (typeof window !== 'undefined') {
    database = loadDatabase();
  }
  return database.rewards;
};

export const addReward = (reward: Omit<Reward, 'id'>): void => {
  const newReward: Reward = {
    ...reward,
    id: Date.now().toString()
  };
  database.rewards.push(newReward);
  saveDatabase(database);
};

export const updateReward = (id: string, updates: Partial<Reward>): boolean => {
  const rewardIndex = database.rewards.findIndex(reward => reward.id === id);
  if (rewardIndex === -1) return false;
  
  database.rewards[rewardIndex] = { ...database.rewards[rewardIndex], ...updates };
  saveDatabase(database);
  return true;
};

export const deleteReward = (id: string): boolean => {
  const rewardIndex = database.rewards.findIndex(reward => reward.id === id);
  if (rewardIndex === -1) return false;
  
  database.rewards.splice(rewardIndex, 1);
  saveDatabase(database);
  return true;
};

// Leaderboard functions
export const getLeaderboard = (limit?: number): Player[] => {
  // Refresh database from localStorage on each call
  if (typeof window !== 'undefined') {
    database = loadDatabase();
  }
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
