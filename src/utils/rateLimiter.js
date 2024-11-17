const redis = require('redis');
const config = require('../config');

const redisClient = redis.createClient({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT
});

const checkRateLimit = async (userId) => {
  const currentSecond = Math.floor(Date.now() / 1000);
  const currentMinute = Math.floor(Date.now() / (1000 * 60));

  const secondKey = `user:${userId}:rate-limit:second:${currentSecond}`;
  const minuteKey = `user:${userId}:rate-limit:minute:${currentMinute}`;

  const secondCount = await redisClient.get(secondKey) || 0;
  const minuteCount = await redisClient.get(minuteKey) || 0;

  if (secondCount >= config.MAX_TASKS_PER_SECOND || minuteCount >= config.MAX_TASKS_PER_MINUTE) {
    return false;
  }

  await redisClient.multi()
    .incr(secondKey)
    .incr(minuteKey)
    .expire(secondKey, 1)
    .expire(minuteKey, 60)
    .exec();

  return true;
};

module.exports = { checkRateLimit };
