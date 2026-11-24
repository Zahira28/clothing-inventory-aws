require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// Health check + DB connectivity test (useful as AWS evidence)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// CREATE
app.post('/clothes', async (req, res) => {
  const { name, material, size, brand, price, stock } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO clothes (name, material, size, brand, price, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, material, size, brand, price, stock ?? 0]
    );
    res.status(201).json({ id: result.insertId, name, material, size, brand, price, stock: stock ?? 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all
app.get('/clothes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clothes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one
app.get('/clothes/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clothes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/clothes/:id', async (req, res) => {
  const { name, material, size, brand, price, stock } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE clothes SET name = ?, material = ?, size = ?, brand = ?, price = ?, stock = ? WHERE id = ?',
      [name, material, size, brand, price, stock, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/clothes/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clothes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));