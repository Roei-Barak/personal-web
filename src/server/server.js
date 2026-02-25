// Express backend for Ski Trip Manager
const express = require('express');
const db = require('./db');
const initData = require('./initData');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'ski-trip-secret'; // Change for production

// ─── AUTH ──────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const hash = await bcrypt.hash(password, 10);
  try {
    db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hash);
    // Seed INIT data for new user
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    const userId = user.id;
    // Seed items
    for (const item of initData.items) {
      db.prepare('INSERT INTO items (user_id, cat, name, status, packed, optional, img) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(userId, item.cat, item.name, item.status, item.packed ? 1 : 0, item.optional ? 1 : 0, item.img);
    }
    // Seed reminders
    for (const r of initData.reminders) {
      db.prepare('INSERT INTO reminders (user_id, text, done, priority, emoji) VALUES (?, ?, ?, ?, ?)')
        .run(userId, r.text, r.done ? 1 : 0, r.priority, r.emoji);
    }
    // Seed resorts
    for (const r of initData.resorts) {
      db.prepare('INSERT INTO resorts (user_id, name, flag, country, flight, pkg, level, rating, details, lat, lng, airport, airportCode, airportLat, airportLng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(userId, r.name, r.flag, r.country, r.flight, r.pkg, r.level, r.rating, r.details, r.lat, r.lng, r.airport, r.airportCode, r.airportLat, r.airportLng);
    }
    // Seed insurance
    for (const ins of initData.insurance) {
      db.prepare('INSERT INTO insurance (user_id, name, logo, medical, sports, cancel, cancelNote, price, features, sports_detail, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(userId, ins.name, ins.logo, ins.medical, String(ins.sports), String(ins.cancel), ins.cancelNote, ins.price, JSON.stringify(ins.features), ins.sports_detail, ins.contact);
    }
    // Seed places
    for (const p of initData.places) {
      db.prepare('INSERT INTO places (user_id, name, type, visited, emoji, note) VALUES (?, ?, ?, ?, ?, ?)')
        .run(userId, p.name, p.type, p.visited ? 1 : 0, p.emoji, p.note);
    }
    // Seed uploads
    for (const u of initData.uploads) {
      db.prepare('INSERT INTO uploads (user_id, title, done, platform) VALUES (?, ?, ?, ?)')
        .run(userId, u.title, u.done ? 1 : 0, u.platform);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  try {
    const { userId } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── CRUD ENDPOINTS ─────────────────────────────────────────────────────
// Packing Items
app.get('/api/items', authMiddleware, (req, res) => {
  const items = db.prepare('SELECT * FROM items WHERE user_id = ?').all(req.userId);
  res.json(items);
});
app.post('/api/items', authMiddleware, (req, res) => {
  const { cat, name, status, packed, optional, img } = req.body;
  db.prepare('INSERT INTO items (user_id, cat, name, status, packed, optional, img) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(req.userId, cat, name, status, packed ? 1 : 0, optional ? 1 : 0, img);
  res.json({ success: true });
});
app.put('/api/items/:id', authMiddleware, (req, res) => {
  const { cat, name, status, packed, optional, img } = req.body;
  db.prepare('UPDATE items SET cat = ?, name = ?, status = ?, packed = ?, optional = ?, img = ? WHERE id = ? AND user_id = ?')
    .run(cat, name, status, packed ? 1 : 0, optional ? 1 : 0, img, req.params.id, req.userId);
  res.json({ success: true });
});
app.delete('/api/items/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ success: true });
});

// Repeat similar CRUD endpoints for reminders, resorts, insurance, places, uploads
// ... (for brevity, only items shown here)

const PORT = 5000;
app.listen(PORT, () => {
  console.log('Ski Trip Manager backend running on port', PORT);
});
