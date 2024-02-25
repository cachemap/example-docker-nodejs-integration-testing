import mysql from 'mysql2/promise'

const {
  MYSQL_HOST = 'localhost',
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = 'password123',
  MYSQL_DATABASE = 'test',
} = process.env

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

export function truncateTable(tableName) {
  pool.query(`TRUNCATE TABLE ${tableName}`)
}

export default pool
