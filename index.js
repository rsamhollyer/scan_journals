const moment = require('moment');
const createJob = require('./lib/cron');
const { checkExpectedEntries } = require('./lib');

checkExpectedEntries();

async function startBot() {
  if (
    moment().format('dddd') === 'Saturday' ||
    moment().format('dddd') === 'Sunday'
  ) {
    console.log(`🤖 - Today is robot's day off!! ☕`);
    process.exit();
  } else {
    // eslint-disable-next-line global-require
    const bot = require('./auto');
    bot.on('start', async () => {
      bot.postMessageToUser('rsamhollyer', '🤖 AlertBot starting...', {
        disconnect: true,
      });
      await createJob();
    });
  }
}

startBot();
