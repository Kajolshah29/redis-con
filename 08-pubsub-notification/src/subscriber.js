import Redis from 'ioredis';

const subscriber = new Redis( process.env.REDIS_URL || 'redis://localhost:6379' );

subscriber.subscribe('notifications', (err) => {
    if (err) {
        console.error('Error occurred while subscribing to notifications:', err);
    } else {
        console.log('Successfully subscribed to notifications channel');
    }
});


subscriber.on('message', (channel, message) => {
    console.log("Received message on channel", channel, ":", JSON.parse(message));
});