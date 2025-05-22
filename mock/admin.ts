// mock API cho admin

import { Request, Response } from 'express';
import { join } from 'path';
import fs from 'fs';

// Đường dẫn tới file db.json
const dbPath = join(process.cwd(), 'db.json');

// Hàm đọc dữ liệu từ db.json
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { truong: [], ho_so: [], admin: [], nganh: [], to_hop_xet_tuyen: [] };
  }
};

// Hàm ghi dữ liệu vào db.json
const writeDB = (data: any) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to db.json:', error);
    return false;
  }
};

export default {
  // API quản trị viên
  'GET /api/admin': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json(db.admin);
  },
  
  'GET /api/admin/1': (req: Request, res: Response) => {
    const db = readDB();
    const admin = db.admin.find((item: any) => item.id === 1);
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  },

  // API trường đại học
  'GET /api/truong': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách trường thành công',
      data: db.truong
    });
  },
  
  'GET /api/truong/:id': (req: Request, res: Response) => {
    const db = readDB();
    const truongId = parseInt(req.params.id);
    const truong = db.truong.find((item: any) => item.id === truongId);
    
    if (truong) {
      res.status(200).json({
        success: true,
        message: 'Lấy thông tin trường thành công',
        data: truong
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy trường',
        data: null
      });
    }
  },

  // API hồ sơ
  'GET /api/ho-so': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách hồ sơ thành công',
      data: db.ho_so
    });
  },
  
  // API lấy chi tiết hồ sơ theo ID
  'GET /api/ho-so/:id': (req: Request, res: Response) => {
    const db = readDB();
    const hoSoId = parseInt(req.params.id);
    const hoSo = db.ho_so.find((item: any) => item.id === hoSoId);
    
    if (hoSo) {
      res.status(200).json({
        success: true,
        message: 'Lấy thông tin hồ sơ thành công',
        data: hoSo
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ với ID cung cấp',
        data: null
      });
    }
  },
  
  // API cập nhật trạng thái hồ sơ
  'PATCH /api/ho-so/:id/status': (req: Request, res: Response) => {
    const db = readDB();
    const hoSoId = parseInt(req.params.id);
    const { trang_thai, ghi_chu } = req.body;
    
    const hoSoIndex = db.ho_so.findIndex((item: any) => item.id === hoSoId);
    
    if (hoSoIndex !== -1) {
      // Cập nhật trạng thái và ghi chú
      db.ho_so[hoSoIndex] = {
        ...db.ho_so[hoSoIndex],
        trang_thai,
        ghi_chu: ghi_chu || db.ho_so[hoSoIndex].ghi_chu
      };
      
      // Lưu thay đổi vào db.json
      const success = writeDB(db);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Cập nhật trạng thái hồ sơ thành công',
          data: db.ho_so[hoSoIndex]
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Không thể lưu thay đổi vào cơ sở dữ liệu',
          data: null
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ với ID cung cấp',
        data: null
      });
    }
  },

  // API lấy ngành đào tạo theo trường
  'GET /api/nganh/truong/:truongId': (req: Request, res: Response) => {
    const db = readDB();
    const truongId = parseInt(req.params.truongId);
    
    // Lọc theo trường ID
    const nganhTheoTruong = db.nganh.filter((item: any) => item.truong_id === truongId);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách ngành theo trường thành công',
      data: nganhTheoTruong,
    });
  },

  // API lấy tổ hợp xét tuyển theo ngành
  'GET /api/to-hop/nganh/:nganhId': (req: Request, res: Response) => {
    const db = readDB();
    const nganhId = parseInt(req.params.nganhId);
    
    // Lọc theo ngành ID
    const toHopTheoNganh = db.to_hop_xet_tuyen.filter((item: any) => item.nganh_id === nganhId);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tổ hợp xét tuyển theo ngành thành công',
      data: toHopTheoNganh,
    });
  },

  'POST /api/login': (req: Request, res: Response) => {
    const db = readDB();
    const { username, password } = req.body;
    const admin = db.admin.find((item: any) => item.username === username);
    
    if (admin && admin.password === password) {
      res.status(200).send({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
          truong_id: admin.truong_id,
          ho_ten: admin.ho_ten,
          token: 'valid-token-12345',
        },
      });
      return;
    }
    
    res.status(401).send({
      success: false,
      message: 'Sai tên đăng nhập hoặc mật khẩu',
    });
  },
}; 