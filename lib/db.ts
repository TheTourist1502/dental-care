import mysql from 'mysql2/promise'

// Singleton connection pool — reused across API calls in production
declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dental_clinic',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+05:30', // IST
  })
}

// In dev, attach to global to survive hot reloads
const pool = global._mysqlPool ?? createPool()
if (process.env.NODE_ENV !== 'production') global._mysqlPool = pool

export default pool
