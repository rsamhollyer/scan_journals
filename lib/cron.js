const cron = require('node-cron');
const studentData = require('../student_repos/data');
const { go } = require('./index');
const { generateReport } = require('./reportoutputs');
const db = require('../db/db');
const bot = require('../auto');

function createJob() {
  const task = cron.schedule(
    '* * * * 1-5',
    async () => {
      console.log('⏲️ RUNNING CRON JOB');
      await bot.postMessageToChannel('random', `'⏲️ RUNNING CRON JOB'`);
      const students = await go(studentData);
      await db.get('students').assign(students).write();
      await db.set('lastRun', new Date()).write();
      const reportData = generateReport();
      await bot.postMessageToChannel('random', `${reportData}`);
      await bot.postMessageToChannel(
        'random',
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
