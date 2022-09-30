const { Pool } = require("pg")
const { connectionString } = require('../config/config')

const pool = new Pool({
     connectionString: connectionString
     // host: 'localhost',
     // user: 'isroilsi_geno',
     // password: 'Muzaffarbek04',
     // port: 5432, 
     // database: 'isroilsi_telegram_bot' 

     // host: 'localhost',
     // port: 5432,
     // password: 'Muzaffarbek04'

     // postgres://isroilsi_telegram_bot1:txKeAULHJD@server2.ahost.cloud/isroilsi_telegram_bot
})
  
const fetch = async (SQL, ...params) => {
     const client = await pool.connect()

     try {
          const { rows: [row] } = await client.query(SQL, params.length ? params : null)

          return row
     } finally {
          client.release()
     }
}

const fetchAll = async (SQL, ...params) => {
     const client = await pool.connect()

     try {
          const { rows } = await client.query(SQL, params.length ? params : null)
          return rows
     } finally {
          client.release()
     }
}


module.exports = {
     fetchAll,
     fetch
}