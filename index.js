const { apiDAO } = require('./api')
const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()
const port = 3001

app.get('/test', (req, res) => {
    apiDAO.updateStatus()
    apiDAO.tisu()
    res.send('OK')
})

const uri = process.env.LOCAL_DB_URI || 'mongodb://localhost:27017'
MongoClient.connect(
    uri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        { poolSize: 50, w: 1, wtimeout: 2500 }
    )
    .catch(err => {
      console.error(err.stack)
      process.exit(1)
    })
    .then(async client => {
      await ConfigsDAO.injectDB(client)
      app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`)
    })
    })


