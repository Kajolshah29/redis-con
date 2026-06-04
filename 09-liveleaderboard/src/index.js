import express from 'express';
import {
	getLeaderboard,
	getUserRank,
	incrementPostView,
	updateScore
} from './leaderboard.js';

const app = express();
app.use(express.json());

app.post('/post/:id/view', async (req, res) => {
	const views = await incrementPostView(req.params.id);

	res.json({
		postId: req.params.id,
		views
	});
});

app.post('/leaderboard/score', async (req, res) => {
	const { userId, score } = req.body;
	const numericScore = Number(score);

	if (!userId || Number.isNaN(numericScore)) {
		return res.status(400).json({
			message: 'userId and numeric score are required'
		});
	}

	await updateScore(userId, numericScore);

	res.json({
		message: 'Score updated',
		userId,
		score: numericScore
	});
});

app.get('/leaderboard', async (req, res) => {
	const leaderboard = await getLeaderboard();

	res.json({
		leaderboard
	});
});

app.get(['/leaderboard/:userid/rank', '/leaderboard/:userid/rand'], async (req, res) => {
	const user = await getUserRank(req.params.userid);

	if (!user) {
		return res.status(404).json({
			message: 'User not found on leaderboard'
		});
	}

	res.json(user);
});

app.listen(3000, () => {
	console.log('Server is running on port http://localhost:3000');
});

