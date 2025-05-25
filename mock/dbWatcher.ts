// Tạm thời vô hiệu hóa để tránh xung đột với UMI
// Khi nào cần dùng, hãy đổi tên file thành dbWatcher.ts
/*
import fs from 'fs';
import { join } from 'path';
import chokidar from 'chokidar';

// Đường dẫn tới file db.json
const dbPath = join(process.cwd(), 'db.json');

// Tạo watcher để theo dõi thay đổi
const watcher = chokidar.watch(dbPath, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 100
  }
});

// Khi file db.json thay đổi
watcher.on('change', (path) => {
  console.log(`[${new Date().toISOString()}] 🔄 db.json đã được cập nhật`);
  
  // Đọc nội dung mới của file
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    console.log(`📦 Dữ liệu mới: ${data.substring(0, 100)}...`);
  } catch (error) {
    console.error('❌ Lỗi đọc file db.json:', error);
  }
});

console.log(`[${new Date().toISOString()}] 👀 Đang theo dõi thay đổi trên file db.json...`);

export default watcher;
*/ 