const moment = require('moment');
const createJob = require('./lib/cron');
const { checkExpectedEntries } = require('./lib');

async function startBot() {
  if (
    moment().format('dddd') === 'Saturday' ||
    moment().format('dddd') === 'Sunday'
  ) {
    await checkExpectedEntries();
    console.log(`🤖 - Today is robot's day off!! ☕`);
    process.exit();
  } else {
    // eslint-disable-next-line global-require
    const bot = await require('./auto');
    bot.on('start', async () => {
      bot.postMessageToChannel('random', '🤖 AlertBot starting...');
      const result = await createJob();
    });
  }
}

startBot();
