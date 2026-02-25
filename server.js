import express from 'express';
import sqlite3 from 'sqlite3';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================
// DATABASE SETUP
// ============================================================
const db = new sqlite3.Database(
  path.join(__dirname, 'database.sqlite'),
  (err) => {
    if (err) {
      console.error('Database connection error:', err);
      process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
);

// Helper: Promise wrapper for db.run and db.get
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database tables
async function initializeDatabase() {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ski items table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS ski_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        status TEXT DEFAULT 'need',
        packed INTEGER DEFAULT 0,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Ski expenses table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS ski_expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        payer_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (payer_id) REFERENCES users(id)
      )
    `);

    // Musical characters table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS musical_characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        actor TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Musical scenes table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS musical_scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        act TEXT,
        duration TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Seed admin user if not exists
    const adminExists = await dbGet('SELECT id FROM users WHERE email = ?', ['admin@local.test']);
    if (!adminExists) {
      const hashedPassword = await bcryptjs.hash('password123', 10);
      await dbRun(
        `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        [uuidv4(), 'admin@local.test', hashedPassword, 'admin']
      );
      console.log('✅ Seeded admin user: admin@local.test / password123');
    }

    // Seed friend user if not exists
    const friendExists = await dbGet('SELECT id FROM users WHERE email = ?', ['friend@local.test']);
    if (!friendExists) {
      const hashedPassword = await bcryptjs.hash('password123', 10);
      await dbRun(
        `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        [uuidv4(), 'friend@local.test', hashedPassword, 'approved_friend']
      );
      console.log('✅ Seeded friend user: friend@local.test / password123');
    }

    console.log('✅ Database initialized with all tables');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// ============================================================
// MIDDLEWARE: Verify JWT Token
// ============================================================
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const userId = uuidv4();

    // Create user with 'pending' role
    await dbRun(
      `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [userId, email, hashedPassword, 'pending']
    );

    // Generate token
    const token = jwt.sign(
      { id: userId, email, role: 'pending' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: userId, email, role: 'pending' },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me - Get current user from token
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================

// GET /api/users - Get all users (admin only)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await dbAll(
      'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/users/:id/role - Update user role (admin only)
app.put('/api/users/:id/role', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'approved_friend', 'pending'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Update user role
    const result = await dbRun('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await dbGet('SELECT id, email, role FROM users WHERE id = ?', [id]);
    res.json({ user: updatedUser, message: 'Role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// ============================================================
// SKI DASHBOARD ROUTES
// ============================================================

// GET /api/ski/items - Get all ski items for user
app.get('/api/ski/items', verifyToken, async (req, res) => {
  try {
    const items = await dbAll(
      'SELECT * FROM ski_items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ski items' });
  }
});

// POST /api/ski/items - Create ski item
app.post('/api/ski/items', verifyToken, async (req, res) => {
  try {
    const { name, category, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }

    const result = await dbRun(
      `INSERT INTO ski_items (user_id, name, category, status) VALUES (?, ?, ?, ?)`,
      [req.user.id, name, category || 'Other', status || 'need']
    );

    const item = await dbGet('SELECT * FROM ski_items WHERE id = ?', [result.id]);
    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ski item' });
  }
});

// PUT /api/ski/items/:id - Update ski item
app.put('/api/ski/items/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, status, packed } = req.body;

    const result = await dbRun(
      `UPDATE ski_items SET name = ?, category = ?, status = ?, packed = ? WHERE id = ? AND user_id = ?`,
      [name, category, status, packed, id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await dbGet('SELECT * FROM ski_items WHERE id = ?', [id]);
    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ski item' });
  }
});

// DELETE /api/ski/items/:id - Delete ski item
app.delete('/api/ski/items/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun(
      'DELETE FROM ski_items WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ski item' });
  }
});

// ============================================================
// MUSICAL DASHBOARD ROUTES
// ============================================================

// GET /api/musical/characters - Get all characters for user
app.get('/api/musical/characters', verifyToken, async (req, res) => {
  try {
    const characters = await dbAll(
      'SELECT * FROM musical_characters WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ characters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// POST /api/musical/characters - Create character
app.post('/api/musical/characters', verifyToken, async (req, res) => {
  try {
    const { name, role, actor, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }

    const result = await dbRun(
      `INSERT INTO musical_characters (user_id, name, role, actor, notes) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, name, role || '', actor || 'TBD', notes || '']
    );

    const character = await dbGet('SELECT * FROM musical_characters WHERE id = ?', [result.id]);
    res.json({ character });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// PUT /api/musical/characters/:id - Update character
app.put('/api/musical/characters/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, actor, notes } = req.body;

    const result = await dbRun(
      `UPDATE musical_characters SET name = ?, role = ?, actor = ?, notes = ? WHERE id = ? AND user_id = ?`,
      [name, role, actor, notes, id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const character = await dbGet('SELECT * FROM musical_characters WHERE id = ?', [id]);
    res.json({ character });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// DELETE /api/musical/characters/:id - Delete character
app.delete('/api/musical/characters/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun(
      'DELETE FROM musical_characters WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json({ message: 'Character deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

// GET /api/musical/scenes - Get all scenes for user
app.get('/api/musical/scenes', verifyToken, async (req, res) => {
  try {
    const scenes = await dbAll(
      'SELECT * FROM musical_scenes WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ scenes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scenes' });
  }
});

// POST /api/musical/scenes - Create scene
app.post('/api/musical/scenes', verifyToken, async (req, res) => {
  try {
    const { name, act, duration, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }

    const result = await dbRun(
      `INSERT INTO musical_scenes (user_id, name, act, duration, notes) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, name, act || '', duration || '', notes || '']
    );

    const scene = await dbGet('SELECT * FROM musical_scenes WHERE id = ?', [result.id]);
    res.json({ scene });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create scene' });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'running' });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📧 Test login: admin@local.test / password123`);
  console.log(`👥 Test friend: friend@local.test / password123\n`);
});
