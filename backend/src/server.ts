// backend/src/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { gameHandler } from './sockets/gameHandler';

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// Khởi tạo Socket.io với CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Trong thực tế, hãy điền domain của frontend
    methods: ['GET', 'POST'],
  },
});

// Chờ kết nối từ Frontend
io.on('connection', (socket) => {
  console.log(`[SOCKET] Kết nối: ${socket.id}`);

  // Đăng ký các sự kiện xử lý game
  gameHandler(io, socket);

  socket.on('disconnect', () => {
    console.log(`[SOCKET] Ngắt kết nối: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`[SERVER] Đang chạy tại http://localhost:${PORT}`);
});