const cron = require('node-cron');
const studentData = require('../student_repos/data');
const { go, checkExpectedEntries, generateReport } = require('./index');
const db = require('../db/db');

cron.schedule('* * * * * *', async () => {
  console.log('⏲️ RUNNING CRON JOB');
  // const students = await go(studentData);
  // db.get('students').assign(students).write();
  checkExpectedEntries();
  generateReport();
});

module.exports = cron;
