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
            //timeout: 1500,
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

    static async tisu () {
        try {
            const res = fetch("https://tisu-api.speedtest.cn/api/v2/speedup/reopen?source=www", {
                "headers": {
                  "accept": "application/json, text/plain, */*",
                  "accept-language": "en-US,en;q=0.9",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                  "x-csrf-token": "",
                  "x-requested-with": "XMLHttpRequest",
                  "cookie": "_ga=GA1.2.667675721.1596437884; UM_distinctid=173b31cec0445b-0ea8560860caa-3323765-e1000-173b31cec057e7; __gads=ID=b2cb1ff6d0ab990e:T=1597990683:S=ALNI_MbhF99yehzRL30K4KJNDIE1isxUdA; Hm_lvt_8decfd249e4c816635a72c825e27da1a=1597990684; _gid=GA1.2.1681173685.1598149396; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6Ik15d2EwMkJMUXdTQ29RUThXd0QxMlE9PSIsInZhbHVlIjoiSEc2RWVpdkdFdXNQT1J2YmdKNXkwMHQzWGx3ODJUN1U3QmJVVWwrS3ludjZhWXNVQjRcL1d6YlwvU1hpN0NUS3ZCdGtoUHc1Y2YxMCtUSlJqXC8zRWw4YnNPMUUxK1NpRlBcL05jMExFRTFhUjQwPSIsIm1hYyI6IjgxMzI1NzFkYTQ3ZjVhMmUxMmE3N2EyYzk5NDdhN2EyZGRjOWZmZGY3OGNhYzhjNjhkNTIzODBkZDY5YzEwZGEifQ%3D%3D; Hm_lpvt_8decfd249e4c816635a72c825e27da1a=1598179700; laravel_token=eyJpdiI6ImpzUWVNWUFpVG5EQ2FPM2JsOWI3UUE9PSIsInZhbHVlIjoiZVFrTlR5c1wvNVVIQkorNFBpTkp4VnBGZEhqYW40dFBEUWtiTVRIVVwvcDNoSEl3Tk9aamxVblQ0RmFadDhaSFNqcCtIaVwvRTRGb0ZRU0l4ZzYzWU5cLytSZzg0MjRLV0Z6MlVxT3hJbkVsMTQwUkZjMElUYzNpblpDcUpZNktvZDkrMVA5dTZ0ak5lUXlMTGNkUGNSVWhYUUVlQnBKRlJXb0xOb2RibDY4RlFWWWlWQlVSemtrMHowN3pwYlpWcGhjZ25ONGM4cFhEeG1POEhPMERoM3A3NDNJS0hOdWsyY3dcL0F1eExGXC9HZFhZcVpxOXFVUUI0djhqSGttNU5FNTRzdmg1M1o3dUhEVDh0VTluaUV3bUdjT2c9PSIsIm1hYyI6ImZkMmNkODY2ODQwMDlhNmEyZmJhMGVkMWNlODhjNGU1ZmVkNjU3MmU5NWIwYWE3NTg0NTE2Y2Q4NWUyZmZlMWQifQ%3D%3D; speedtest_session=eyJpdiI6ImN4dU5Eb2J6em5Oc0tQNGxodjVRaVE9PSIsInZhbHVlIjoiOVV4VFdCVjVaT2c5cmxJbWhWRlNGc3B1QjNGek5na1RKd2JJTXFyQ2xlUTc0b0lvNytjYWFaQnB0UDQwYXJYUCIsIm1hYyI6IjQ5MDAwMjEwODg0NjU0MTg0MTdlOWQyMTE2MGY2NTgyYjk3YjNjYjAyNmE5NmI0Njg4YmVmNGFjMWM5MmQzZjAifQ%3D%3D"
                },
                "referrer": "https://www.speedtest.cn/",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors"
              })
              console.log(res)

              return res
              
        } catch (error) {
            
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
apiDAO.tisu()