import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Simple login: matches email + password
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing' });

  const user = await prisma.user.findUnique({ where: { email }, include: { roles: true } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  // Return basic user object
  res.json({ user: { id: user.id, email: user.email } });
});

// Sign up: create user with pending role
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing' });

  const hashed = await bcrypt.hash(password, 8);
  try {
    const created = await prisma.user.create({
      data: {
        email,
        password: hashed,
        roles: { create: [{ role: 'pending' }] },
      },
      include: { roles: true },
    });
    res.json({ user: { id: created.id, email: created.email } });
  } catch (e) {
    res.status(500).json({ error: 'Could not create user', details: e.message });
  }
});

// Get user's role
app.get('/api/user_roles', async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  const role = await prisma.userRole.findFirst({ where: { user_id: String(user_id) } });
  if (!role) return res.json({ role: null });
  res.json({ role: role.role });
});

const port = process.env.PORT || 54321;
app.listen(port, () => console.log(`Dev API listening on http://localhost:${port}`));
