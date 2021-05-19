const cron = require('node-cron');
const studentData = require('../student_repos/data');
const { go, checkExpectedEntries, generateReport } = require('./index');
const db = require('../db/db');
const bot = require('../auto');

function createJob() {
  const task = cron.schedule(
    '* * * * * ',
    async () => {
      console.log('⏲️ RUNNING CRON JOB');
      const students = await go(studentData);
      await db.get('students').assign(students).write();
      await checkExpectedEntries();
      const reportData = await generateReport();
      bot.postMessageToChannel('our-marriage', `${reportData}`);
    },
    { scheduled: true, timezone: 'America/Chicago' }
  );
  task.start();
}
module.exports = createJob;
