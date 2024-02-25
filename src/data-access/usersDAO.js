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

