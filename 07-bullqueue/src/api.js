import express from 'express';
import Redis from 'ioredis';
import {emailQueue} from './queue.js';
const app = express();
app.use(express.json());

app.post('/welcome-email', async (req, res) => {
    const jobData = emailQueue.add(
        'welcomeEmail',
         { 
               to: req.body.to,
               name: req.body.name || 'User',   
         },
         {
         attempts: 3,
         backoff: {
             type: 'exponential',
             delay: 1000,
         }
        }
        );
        res.json({message: 'Welcome email job has been queued', jobId: jobData.id});
});


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});

