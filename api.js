require('dotenv').config()
const { MongoClient } = require('mongodb')
const got = require('got')

class apiDAO {
    static getDb () {
        const url = process.env.LOCAL_DB_URI || 'mongodb://localhost:27017'
        const client = new MongoClient(
          url,
          { useNewUrlParser: true, useUnifiedTopology: true },
          { poolSize: 50, w: 1, wtimeout: 2500 }
        )
        return client
    }

    static async testGot (hostname) {
        try {
        const options = {
            url: "https://" + hostname,
            timeout: 1500,
            retry: 2
        }
        const response = await got(options)        
        //console.log(response.statusMessage)
        //console.log(response.statusCode)
        return response.statusCode
        } catch (error) {
        console.log(error.response)
        return error
        }
    }

    static async getHostname () {
        try {
            const conn = await apiDAO.getDb().connect()
            const configs = await conn.db('test').collection('configs')
            const config = await configs.find({ type: 'A' }, { name: 1, _id: 0 }).limit(50).toArray()
            let newConfig = await config
            .filter( obj => isNaN(Number(obj['name'].slice(1,3))) === false )
            .map(dict => dict['name'])
            console.log(newConfig)
            return newConfig
        } catch (e) {
            console.error(e)
        }
    }

    static async updateStatus () {
        try {
            const conn = await apiDAO.getDb().connect()
            const configs = await conn.db('test').collection('configs')
            const hostNames = await Promise.all((await apiDAO.getHostname()).map(
                async (hostname) => {
                    console.log(hostname)
                    let status = (await apiDAO.testGot(hostname) === 200) ? 'online' : 'offline'
                    console.log(status)
                    configs.findOneAndUpdate({name:hostname},{$set:{status:status}})
                    }
                ))
                .then(res => res)
            console.log(hostNames)

        } catch (error) {
        console.log(error)
        return error
        }
    }
    }


module.exports = { apiDAO: apiDAO }
