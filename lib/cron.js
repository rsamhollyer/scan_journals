const cron = require('node-cron');
const studentData = require('../student_repos/data');
const { go, checkExpectedEntries, generateReport } = require('./index');
const db = require('../db/db');
const bot = require('../auto');

function createJob() {
  const task = cron.schedule(
    '* * * * 1-5',
    async () => {
      console.log('⏲️ RUNNING CRON JOB');
      await bot.postMessageToChannel('our-marriage', `'⏲️ RUNNING CRON JOB'`);
      const students = await go(studentData);
      await db.get('students').assign(students).write();
      await db.set('lastRun', new Date()).write();
      await checkExpectedEntries();
      const reportData = await generateReport();
      await bot.postMessageToChannel('our-marriage', `${reportData}`);
      await bot.postMessageToChannel(
        'our-marriage',
        `🤖 ROBOT DONE WITH CRON JOB! ☕`
      );
      console.log('🤖 ROBOT DONE WITH CRON JOB! ☕');
      process.exit();
    },
    { scheduled: true, timezone: 'Etc/UTC' }
  );
  task.start();
}
module.exports = createJob;
