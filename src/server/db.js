// SQLite setup for Express backend
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'ski-trip.sqlite'));

// Create tables if not exist
// Users
// Packing Items
// Reminders
// Resorts
// Insurance
// Places
// Uploads

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  cat TEXT,
  name TEXT,
  status TEXT,
  packed INTEGER,
  optional INTEGER,
  img TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  text TEXT,
  done INTEGER,
  priority TEXT,
  emoji TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS resorts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  flag TEXT,
  country TEXT,
  flight TEXT,
  pkg TEXT,
  level TEXT,
  rating INTEGER,
  details TEXT,
  lat REAL,
  lng REAL,
  airport TEXT,
  airportCode TEXT,
  airportLat REAL,
  airportLng REAL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS insurance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  logo TEXT,
  medical TEXT,
  sports TEXT,
  cancel TEXT,
  cancelNote TEXT,
  price TEXT,
  features TEXT,
  sports_detail TEXT,
  contact TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  type TEXT,
  visited INTEGER,
  emoji TEXT,
  note TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT,
  done INTEGER,
  platform TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

module.exports = db;