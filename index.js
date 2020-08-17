const { apiDAO } = require('./api')
const Cronjob = require('cron').CronJob
const express = require('express')
const app = express()
const port = 3001

let job = new Cronjob (
    '* */5 * * * *',
    apiDAO.updateStatus(),
    null,
    true
)

app.get('/test', (req, res) => {
    apiDAO.updateStatus()
    res.send('OK')
})


app.listen(port, () => {
   console.log(`listening at http://localhost:${port}`)
})