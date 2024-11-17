const rateLimiter = require('../utils/rateLimiter');
const taskQueue = require('../queues/taskQueue');

const submitTask = async (req, res) => {
  const { userId } = req.params;
  const taskData = req.body.taskData;

  const isAllowed = await rateLimiter.checkRateLimit(userId);

  if (!isAllowed) {
    return res.status(429).json({
      message: 'Rate limit exceeded. Task has been queued and will be processed shortly.',
    });
  }

  await taskQueue.addTaskToQueue({ userId, taskData });

  res.status(202).json({
    message: 'Task has been queued successfully.',
    userId,
    taskData,
  });
};

module.exports = { submitTask };
