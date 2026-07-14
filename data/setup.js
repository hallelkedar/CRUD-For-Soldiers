import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;
const dbName = process.env.DB_NAME;

const initDB = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.MYSQL_ROOT_PASSWORD || "secret",
    });
    await conn.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database (${dbName}) initialized successfully.`);

    await conn.end();
  } catch (error) {
    console.log(`Error while database initial: ${error.message}`);
    throw error;
  }
};

const initTable = async () => {
  const tableQuery = `CREATE TABLE IF NOT EXISTS soldiers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  role TEXT NOT NULL,
  soldier_rank VARCHAR(20) DEFAULT 'pte',
  unit VARCHAR(30) NOT NULL,
  age INT,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
  try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.MYSQL_ROOT_PASSWORD || "secret",
    database: dbName || "soldiers_db",
  });
  await pool.execute(tableQuery)
  console.log('Soldiers table created successfully.')
} catch (error) {
    console.log(`Error while trying to get pool and create table - ${error.message}`)
    throw error
}
};

await initDB()
await initTable()

export const getPool = async () => {
  if (!pool) {
    throw new Error('Enable connect to the database')
  }
  return pool
}

