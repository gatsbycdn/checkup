const { apiDAO } = require('./api')
const Cronjob = require('cron').CronJob
const express = require('express')
const app = express()
const port = 3001

app.get('/test', (req, res) => {
    apiDAO.updateStatus()
    apiDAO.tisu()
    res.send('OK')
})

app.listen(port, () => {
   console.log(`listening at http://localhost:${port}`)
})
