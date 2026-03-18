import fs from 'fs';
import path from 'path';

export type Plan = 'FREE' | 'PRO';

export interface DbUser {
  id: string;
  email: string;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface DbOpportunity {
  id: string;
  eventKey: string;
  outcome: string;
  edge: number;
  percentEdge: number;
  sourceA: string;
  sourceB: string;
  payload: string;
  createdAt: string;
}

export interface DbAlert {
  id: string;
  userId: string;
  eventKey: string;
  outcome: string;
  edge: number;
  message: string;
  delivered: boolean;
  createdAt: string;
}

interface DbShape {
  users: DbUser[];
  opportunities: DbOpportunity[];
  alerts: DbAlert[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'arbiflow.db.json');

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const seed: DbShape = { users: [], opportunities: [], alerts: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
  }
}

function readDb(): DbShape {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as DbShape;
}

function writeDb(data: DbShape) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const id = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function upsertUser(email: string, plan: Plan = 'FREE') {
  const db = readDb();
  const now = new Date().toISOString();
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = { id: id(), email, plan, createdAt: now, updatedAt: now };
    db.users.push(user);
  } else {
    user.plan = plan;
    user.updatedAt = now;
  }
  writeDb(db);
  return user;
}

export function getUserByEmail(email: string) {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function listUsers() {
  const db = readDb();
  return [...db.users].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveOpportunities(items: Omit<DbOpportunity, 'id' | 'createdAt'>[]) {
  const db = readDb();
  const now = new Date().toISOString();
  const created = items.map((item) => ({ ...item, id: id(), createdAt: now }));
  db.opportunities.push(...created);
  // keep latest 5000
  if (db.opportunities.length > 5000) db.opportunities = db.opportunities.slice(-5000);
  writeDb(db);
  return created;
}

export function getRecentOpportunities(limit = 100) {
  const db = readDb();
  return db.opportunities.slice(-limit).reverse();
}

export function saveAlert(alert: Omit<DbAlert, 'id' | 'createdAt'>) {
  const db = readDb();
  const created: DbAlert = { ...alert, id: id(), createdAt: new Date().toISOString() };
  db.alerts.push(created);
  if (db.alerts.length > 10000) db.alerts = db.alerts.slice(-10000);
  writeDb(db);
  return created;
}

export function countAlertsForUserInLast24h(userId: string) {
  const db = readDb();
  const since = Date.now() - 24 * 60 * 60 * 1000;
  return db.alerts.filter((a) => a.userId === userId && new Date(a.createdAt).getTime() >= since).length;
}
