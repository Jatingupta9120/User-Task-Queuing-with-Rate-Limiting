const fs = require('fs');
const config = require('../config');

const logTaskCompletion = (userId, timestamp) => {
  const logMessage = `${userId}-task completed at-${timestamp}\n`;
  fs.appendFileSync(config.LOG_FILE_PATH, logMessage);
};

module.exports = { logTaskCompletion };
