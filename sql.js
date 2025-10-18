const sql = require("mysql2")
require("dotenv").config()



// Allow flexible env names for Vercel and local
const dbHost = process.env.HOST_NAME || process.env.DB_HOST || process.env.MYSQL_HOST
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || process.env.USER
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : (process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined)

module.exports.DB = sql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
})