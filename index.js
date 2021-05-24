const moment = require('moment');
const createJob = require('./lib/cron');
const { checkExpectedEntries } = require('./lib');

if (
  moment().format('dddd') === 'Saturday' ||
  moment().format('dddd') === 'Sunday'
) {
  checkExpectedEntries();
  console.log(`🤖 - Today is robot's day off!! ☕`);
  process.exit();
} else {
  // eslint-disable-next-line global-require
  const bot = require('./auto');
  bot.on('start', () => {
    bot.postMessageToChannel('random', '🤖 AlertBot starting...');
    createJob();
  });
}
