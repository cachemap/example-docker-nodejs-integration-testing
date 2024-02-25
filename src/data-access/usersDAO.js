import pool from '../services/mysqlConnectionPool.js'

export const TABLE_NAME = 'users'

export async function createTable() {
  const sql = `
  CREATE TABLE IF NOT EXISTS
  ${TABLE_NAME} (
    user_id INT AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
  );`.trim()

  return pool.query(sql)
}

export async function getUsers() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE_NAME}`)

  return rows
}

/**
 * @param {Array<{ user_name: string }>} newUsers
 */
export async function insertUsers(newUsers) {
  if (!Array.isArray(newUsers)) {
    throw new Error('newUsers argument must be an array')
  }

  newUsers = newUsers.map(({ user_name }) => [user_name])

  const sql = `INSERT INTO ${TABLE_NAME} (user_name) VALUES ?;`

  await pool.query(sql, [newUsers])
}
