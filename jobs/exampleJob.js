let CronJob = require('cron').CronJob;

// Runs every second
module.exports = new CronJob('* * * * * *', () => {
    let currentTime = new Date()
}, null, true, 'America/Los_Angeles');