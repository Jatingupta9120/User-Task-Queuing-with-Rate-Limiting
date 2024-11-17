const Bull = require('bull');
const fs = require('fs');
const config = require('../config');
const logger = require('../services/logger');

const rateLimitQueue = new Bull('rate-limit-queue', { redis: { host: config.REDIS_HOST, port: config.REDIS_PORT } });

const processTask = async (job) => {
  const { userId, taskData } = job.data;
  const timestamp = Date.now();
  const logMessage = `${userId}-task completed at-${timestamp}\n`;
  fs.appendFileSync(config.LOG_FILE_PATH, logMessage);
  console.log(`Processed task for user ${userId} at ${timestamp}`);
};

rateLimitQueue.process(processTask);

const addTaskToQueue = async (taskData) => {
  await rateLimitQueue.add(taskData, {
    attempts: 3,
    backoff: 1000,
  });
};

module.exports = { addTaskToQueue };
