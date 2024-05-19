const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'chat_app'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API endpoints
app.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/messages', (req, res) => {
  const { username, message } = req.body;
  const query = 'INSERT INTO messages (username, message) VALUES (?, ?)';
  db.query(query, [username, message], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: result.insertId, username, message });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});