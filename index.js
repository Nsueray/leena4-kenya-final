require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const registerRoute = require('./routes/register');
const apiVisitorsRoute = require('./routes/apiVisitors');
const apiCheckinsRoute = require('./routes/apiCheckins');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const expoRoutes = require('./routes/expos');
app.use('/api/expos', expoRoutes);

const formFieldRoutes = require('./routes/formFields');
app.use('/api/form-fields', formFieldRoutes);

const visitorRoutes = require('./routes/visitors');
app.use('/api/visitors', visitorRoutes);

app.use('/register', express.urlencoded({ extended: true }), express.json(), registerRoute);

app.use('/api/checkins', apiCheckinsRoute);

app.use('/api/visitors', apiVisitorsRoute);

const badgeFieldRoutes = require('./routes/badgeFields');
app.use('/api/badge-fields', badgeFieldRoutes);

app.post('/api/checkin/:id', async (req, res) => {
  const visitorId = parseInt(req.params.id);
  if (isNaN(visitorId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    const checkVisitor = await pool.query('SELECT * FROM visitors WHERE id = $1', [visitorId]);
    if (checkVisitor.rows.length === 0) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const visitor = checkVisitor.rows[0];

    await pool.query(
      'INSERT INTO checkin_logs (visitor_id, expo_id) VALUES ($1, $2)',
      [visitor.id, visitor.expo_id]
    );

    console.log(`✅ Check-in for: ${visitor.name} ${visitor.last_name} (${visitor.email})`);

    res.json({
      message: `Welcome ${visitor.name}! Check-in successful.`,
      visitor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Check-in failed' });
  }
});

app.get('/api/checkin-log', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.checkin_time, c.expo_id, v.name, v.last_name, v.fields
      FROM checkin_logs c
      JOIN visitors v ON v.id = c.visitor_id
      ORDER BY c.checkin_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load check-in log' });
  }
});

app.get('/api/visitors/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  try {
    const result = await pool.query(
      `SELECT id, name, last_name, email, expo_id, fields
       FROM visitors
       WHERE name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR fields::text ILIKE $1
       LIMIT 20`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Leena4 API running...');
});

app.use(express.static('public'));

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on port ${process.env.PORT}`);
});
