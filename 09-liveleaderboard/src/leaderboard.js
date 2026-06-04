import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const leaderboardKey = 'leaderboard';

export async function getLeaderboard() {
    const leaderboard = await redis.zrevrange(leaderboardKey, 0, 9, 'WITHSCORES');
    return leaderboard.reduce((acc, curr, index) => {
        if (index % 2 === 0) {
            acc.push({ player: curr, score: parseInt(leaderboard[index + 1], 10) });
        }
        return acc;
    }
    , []);
}

export async function updateScore(player, score) {
    await redis.zincrby(leaderboardKey, score, player);
}

export async function getUserRank(userId) {
    const rank = await redis.zrevrank(leaderboardKey, userId);

    if (rank === null) {
        return null;
    }

    const score = await redis.zscore(leaderboardKey, userId);

    return {
        userId,
        rank: rank + 1,
        score: Number(score)
    };
}

export async function incrementPostView(postId) {
    return redis.hincrby('posts:view-count', postId, 1);
}   
