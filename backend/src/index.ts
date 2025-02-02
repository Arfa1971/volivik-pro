import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import { AddressInfo } from 'net';

const app = express();
const BASE_PORT = 3001;
let currentPort = BASE_PORT;

// Configurar CORS para permitir todas las conexiones
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/v1/products', productRoutes);

const startServer = () => {
  const server = app.listen(currentPort, '0.0.0.0')
    .on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}...`);
        currentPort++;
        server.close();
        startServer();
      } else {
        console.error('Server error:', err);
      }
    })
    .on('listening', () => {
      const address = server.address() as AddressInfo;
      console.log(`Server running on http://localhost:${address.port}`);
      console.log(`Network access on http://192.168.1.69:${address.port}`);
    });
};

startServer();