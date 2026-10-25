import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OrderItem {
  name: string;
  qty: number;
  unit: string;
  total: number;
}

interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // In-memory orders array for order persistence during runtime
  const orders: OrderRecord[] = [];

  // Order submission endpoint
  app.post('/api/orders', (req, res) => {
    const { name, phone, address, city, notes, items, subtotal, deliveryFee, total } = req.body;

    if (!name || !phone || !address || !city) {
      return res.status(400).json({ success: false, error: 'Missing required customer fields' });
    }

    const orderNumber = `#ASF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        address: String(address).trim(),
        city: String(city).trim(),
        notes: notes ? String(notes).trim() : undefined,
      },
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      total: Number(total) || 0,
      status: 'Received - Pending Confirmation',
    };

    orders.unshift(newOrder);
    console.log(`[Al Syed Farm] New Order Received ${orderNumber}:`, JSON.stringify(newOrder, null, 2));

    return res.status(200).json({
      success: true,
      message: 'Thank you for your order from Al Syed Organic Farm! We will contact you soon.',
      order: newOrder,
    });
  });

  // Get orders list
  app.get('/api/orders', (_req, res) => {
    res.json({ success: true, count: orders.length, orders });
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Al Syed Organic Farm API', time: new Date().toISOString() });
  });

  // Vite SPA middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Al Syed Farm] Express + Vite server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
