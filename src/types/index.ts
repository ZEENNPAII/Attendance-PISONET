export interface Player {
  username: string;
  password: string;
  pincode: string;
  attendanceDays: number;
  lastCheckIn: string;
  deleted?: boolean;
  socials: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

export interface Reward {
  id: string;
  name: string;
  requiredDays: number;
  redeemDate: string;
  description: string;
  claimed?: boolean;
}

export interface Database {
  players: Player[];
  rewards: Reward[];
}

export interface AuthUser {
  username: string;
  role: 'player' | 'admin';
}

export interface AttendanceRecord {
  date: string;
  time: string;
  player: string;
}
