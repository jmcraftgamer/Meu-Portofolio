import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prepare } from '../database/connection';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Nome, email e senha sao obrigatorios' });
    return;
  }

  const existing = prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'Email ja cadastrado' });
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hash);
  const user = { id: result.lastInsertRowid as number, name, email, role: 'user' as const };
  const token = generateToken(user);

  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
});

router.post('/login', (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha sao obrigatorios' });
    return;
  }

  const user = prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ error: 'Credenciais invalidas' });
    return;
  }

  const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
});

router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
