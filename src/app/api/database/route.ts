import { NextRequest, NextResponse } from 'next/server';

// In-memory database (will persist across requests within the same serverless instance)
// Note: In production, you should use a real database like PostgreSQL, MongoDB, or Vercel KV
let database: {
  players: any[];
  rewards: any[];
  admin: {
    username: string;
    password: string;
  };
} = {
  players: [],
  rewards: [],
  admin: {
    username: 'ssenpaii21',
    password: 'admin123'
  }
};

export async function GET() {
  try {
    return NextResponse.json(database);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load database' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();
    
    switch (action) {
      case 'addPlayer':
        const newPlayer = {
          ...params,
          id: Date.now().toString(),
          attendanceDays: 0,
          lastCheckIn: null,
          deleted: false
        };
        database.players.push(newPlayer);
        break;
        
      case 'updatePlayer':
        const playerIndex = database.players.findIndex((p: any) => p.username === params.username);
        if (playerIndex !== -1) {
          database.players[playerIndex] = { ...database.players[playerIndex], ...params };
        }
        break;
        
      case 'softDeletePlayer':
        const deleteIndex = database.players.findIndex((p: any) => p.username === params.username);
        if (deleteIndex !== -1) {
          database.players[deleteIndex].deleted = true;
        }
        break;
        
      case 'restorePlayer':
        const restoreIndex = database.players.findIndex((p: any) => p.username === params.username);
        if (restoreIndex !== -1) {
          database.players[restoreIndex].deleted = false;
        }
        break;
        
      case 'addReward':
        const newReward = {
          ...params,
          id: Date.now().toString(),
          claimed: false
        };
        database.rewards.push(newReward);
        break;
        
      case 'updateReward':
        const rewardIndex = database.rewards.findIndex((r: any) => r.id === params.id);
        if (rewardIndex !== -1) {
          database.rewards[rewardIndex] = { ...database.rewards[rewardIndex], ...params };
        }
        break;
        
      case 'deleteReward':
        database.rewards = database.rewards.filter((r: any) => r.id !== params.id);
        break;
        
      case 'markRewardClaimed':
        const claimIndex = database.rewards.findIndex((r: any) => r.id === params.id);
        if (claimIndex !== -1) {
          database.rewards[claimIndex].claimed = true;
        }
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: database });
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}