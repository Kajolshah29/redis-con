import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379'
);
 
app.use(express.json());

function otpKey(phone) {
    return `otp:${phone}`; //used for reliability, we can use a prefix to group related keys together
}

app.post('/otp', async (req, res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); //generate a random 6-digit OTP

    await redis.set(otpKey(phone), otp, 'EX', 300); //expire in 30s
    //it may contains attempts counts, ,max attempts, created at, lastattempted, blockuntil it is used in complex scenarios, but for simplicity we are just storing the OTP value here
    res.json({message: 'otp sent', otp});
});

app.post('/otp/verify', async (req, res) => {
    const {phone, otp} = req.body;
    const storedOtp = await redis.get(otpKey(phone));

    if (!storedOtp) {
        return res.status(400).json({message: 'otp expired or not found'});
    }
    if(storedOtp !== otp) {
        return res.status(400).json({message: 'invalid otp'});
    }   
    await redis.del(otpKey(phone)); //delete the OTP after successful verification
    res.json({message: 'otp verified successfully'});
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ttl});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});