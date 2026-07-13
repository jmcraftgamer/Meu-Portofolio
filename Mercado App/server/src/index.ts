import express from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './database/connection';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import chatRoutes from './routes/chat';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[Central API] Servidor rodando em http://localhost:${PORT}`);
  });
}).catch(console.error);
