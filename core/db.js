require('dotenv').config()

const
    mysql = require('mysql2/promise')

const query = async (sql, params) => {
    try {
        const connection = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            insecureAuth: true,
            namedPlaceholders: true,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        })

        const [result] = await connection.execute(sql, params)

        connection.end()

        return result
    } catch (e) {
        console.log( e )
        return false
    }
}

module.exports = { query }