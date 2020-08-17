const { apiDAO } = require('./api')
const Cronjob = require('cron').CronJob

let job = new Cronjob (
    '* */5 * * * *',
    apiDAO.updateStatus(),
    null,
    true
)