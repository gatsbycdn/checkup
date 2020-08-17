const { apiDAO } = require('./api')
const Cronjob = require('cron').CronJob
const express = require('express')
const app = express()
const port = 3001

const job = new Cronjob (
    '* */1 * * * *',
    function() {
        console.log('crontab doing job')
        apiDAO.updateStatus()
    },
    //apiDAO.updateStatus(),
    null,
    true
)
job.start()

app.get('/test', (req, res) => {
    apiDAO.updateStatus()
    res.send('OK')
})

app.listen(port, () => {
   console.log(`listening at http://localhost:${port}`)
})