import {Worker} from 'bullmq';
import { connection } from './queue.js';

const emailWorker = new Worker('emailQueue', async job => {
    console.log("processing email job", job.id, job.name, job.data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("email job completed", job.id, job.name, job.data);
}, { connection });

worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with error: ${err.message}`);
});

