require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB,
    password : String(process.env.DB_PASSWORD || ""),
    port: process.env.DB_PORT
});

pool.connect((err, client, release) => {
    if (err) {
      return console.error('❌ Error acquiring client', err.stack);
    }
    console.log('✅ Connected to Postgres successfully!');
    process.exit(); // Close the script after success
  });
