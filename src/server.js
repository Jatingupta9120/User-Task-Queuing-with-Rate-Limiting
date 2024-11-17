const express = require('express');
const cluster = require('cluster');
const os = require('os');
const taskController = require('./controllers/taskController');
const config = require('../config');

const app = express();
app.use(express.json());

app.post('/submit-task/:userId', taskController.submitTask);

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
