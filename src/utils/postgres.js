const { Pool } = require("pg")
const { connectionString } = require('../config/config')

const pool = new Pool({
     connectionString: connectionString
     // host: 'ec2-44-209-158-64.compute-1.amazonaws.com',
     // user: 'yvkpjereiwvfsz',
     // password: 'f0ae221316f909d8b685c7b2dba85f87fae61cbf1b3f6d30a3a5cfe9ee149288',
     // port: 5432, 
     // database: 'd997uql3m010e1' 

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