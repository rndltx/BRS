import mysql from 'mysql2/promise';

// Load environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  
  // Test connection
  pool.getConnection()
    .then(connection => {
      console.log('Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('Error connecting to the database:', err);
    });
} catch (error) {
  console.error('Failed to create connection pool:', error);
}

export default pool;