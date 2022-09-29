const { Pool } = require("pg")
const { connectionString } = require('../config/config')

const pool = new Pool({
     connectionString: connectionString
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