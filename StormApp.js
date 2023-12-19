const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based MySQL library

const app = express();
const port = 3000;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Baoduy321@',
  database: 'stormdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// API endpoint to retrieve the list of storms
app.get('/api/retrieve_storms', async (req, res) => {
  try {
    const cityName = req.query.city_name;

    // Use MySQL connection pool
    const [rows] = await pool.query(
      'SELECT * FROM Storm ORDER BY CityName = ? DESC, DetectedTime ASC',
      [cityName]
    );

    // Convert the result to the desired JSON format
    const stormList = rows.map((storm) => ({
      id: storm.id,
      CityName: storm.CityName,
      AffectedAreasCount: storm.AffectedAreasCount,
      DetectedTime: storm.DetectedTime.toISOString(),
    }));

    res.json({ storms: stormList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
