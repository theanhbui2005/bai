// Script để tự động làm mới file db.json trong IDE
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

// Hàm theo dõi file db.json và tự động làm mới khi có thay đổi
function watchAndRefresh() {
  // Đọc nội dung ban đầu
  let lastContent = fs.readFileSync(dbPath, 'utf8');
  console.log('👀 Đang theo dõi file db.json...');

  // Kiểm tra định kỳ
  setInterval(() => {
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(dbPath)) {
      console.log('⚠️ File db.json không tồn tại!');
      return;
    }

    try {
      // Đọc nội dung hiện tại
      const currentContent = fs.readFileSync(dbPath, 'utf8');
      
      // So sánh với nội dung trước đó
      if (currentContent !== lastContent) {
        console.log(`🔄 [${new Date().toISOString()}] db.json đã thay đổi!`);
        
        // Ghi lại file để kích hoạt IDE cập nhật
        fs.writeFileSync(dbPath, currentContent, 'utf8');
        
        // Cập nhật nội dung cuối cùng
        lastContent = currentContent;
      }
    } catch (error) {
      console.error('❌ Lỗi khi đọc/ghi file:', error);
    }
  }, 1000); // Kiểm tra mỗi giây
}

// Bắt đầu theo dõi
watchAndRefresh(); 