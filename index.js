const http = require('http');
const express = require('express');
const db = require('./db/db.js');

const app = express();
const server = http.createServer(app);
const studentData = require('./student_repos/data');
const httpLogger = require('./logs');
const go = require('./lib');

const HOST = 'localhost';
const PORT = 4834;

app.use(httpLogger);

app.get('/', (req, res, next) => {
  res.send('HI');
});

app.get('/scrape', async (req, res, next) => {
  console.log(`SCRAPING!`);
  const students = await go(studentData);
  db.get('students').assign(students).write();
  res.json({ students });
});

server.listen(PORT, HOST, () => {
  console.log(`App listening on http://${HOST}:${PORT}`);
});
