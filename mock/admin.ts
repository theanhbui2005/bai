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
    // Chuyển đổi dữ liệu sang chuỗi JSON với định dạng đẹp
    const jsonData = JSON.stringify(data, null, 2);
    
    // Ghi file
    fs.writeFileSync(dbPath, jsonData, 'utf8');
    
    console.log(`DB updated at ${new Date().toISOString()}`);
    
    return true;
  } catch (error) {
    console.error('Error writing to db.json:', error);
    return false;
  }
};

export default {
  // API quản trị viên
  'GET //admin': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json(db.admin);
  },
  
  'GET //admin/1': (req: Request, res: Response) => {
    const db = readDB();
    const admin = db.admin.find((item: any) => item.id === 1);
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  },
  
  //  kiểm tra đăng nhập admin trực tiếp
  'POST //admin/login': (req: Request, res: Response) => {
    console.log("Nhận yêu cầu đăng nhập admin:", req.body);
    const db = readDB();
    const { username, password } = req.body;
    
    // Tìm admin với username và password tương ứng
    const admin = db.admin.find((a: any) => a.username === username && a.password === password);
    
    console.log("Kết quả tìm kiếm admin:", admin ? "Tìm thấy" : "Không tìm thấy");
    
    if (admin) {
      // Bỏ password khi trả về kết quả
      const { password, ...adminInfo } = admin;
      
      res.status(200).json({
        success: true,
        message: 'Đăng nhập admin thành công',
        data: adminInfo
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }
  },

  //  trường đại học
  'GET //truong': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách trường thành công',
      data: db.truong
    });
  },
  
  'GET //truong/:id': (req: Request, res: Response) => {
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

  //  hồ sơ
  'GET //ho_so': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách hồ sơ thành công',
      data: db.ho_so
    });
  },
  
  //  lấy chi tiết hồ sơ theo ID
  'GET //ho_so/:id': (req: Request, res: Response) => {
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
  
  //  cập nhật trạng thái hồ sơ
  'PATCH //ho_so/:id/status': (req: Request, res: Response) => {
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

  //  lấy ngành đào tạo theo trường
  'GET //nganh/truong/:truongId': (req: Request, res: Response) => {
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

  //  lấy tổ hợp xét tuyển theo ngành
  'GET //to-hop/nganh/:nganhId': (req: Request, res: Response) => {
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

  'POST //login': (req: Request, res: Response) => {
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

  //  thêm trường mới
  'POST //truong': (req: Request, res: Response) => {
    const db = readDB();
    const newSchool = req.body;
    
    // Tạo ID mới (lấy ID lớn nhất hiện tại + 1)
    const maxId = Math.max(...db.truong.map((t: any) => t.id), 0);
    const newId = maxId + 1;
    
    // Thêm trường mới vào db
    const schoolToAdd = {
      id: newId,
      ...newSchool
    };
    
    db.truong.push(schoolToAdd);
    
    // Lưu thay đổi vào db.json
    const success = writeDB(db);
    
    if (success) {
      res.status(201).json({
        success: true,
        message: 'Thêm trường thành công',
        data: schoolToAdd
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu thay đổi vào cơ sở dữ liệu',
        data: null
      });
    }
  },

  //  cập nhật thông tin trường
  'PUT //truong/:id': (req: Request, res: Response) => {
    const db = readDB();
    const truongId = parseInt(req.params.id);
    const updatedSchool = req.body;
    
    const truongIndex = db.truong.findIndex((item: any) => item.id === truongId);
    
    if (truongIndex !== -1) {
      // Cập nhật thông tin trường, giữ nguyên ID
      db.truong[truongIndex] = {
        ...updatedSchool,
        id: truongId
      };
      
      // Lưu thay đổi vào db.json
      const success = writeDB(db);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Cập nhật thông tin trường thành công',
          data: db.truong[truongIndex]
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
        message: 'Không tìm thấy trường với ID cung cấp',
        data: null
      });
    }
  },

  //  xóa trường
  'DELETE //truong/:id': (req: Request, res: Response) => {
    const db = readDB();
    const truongId = parseInt(req.params.id);
    
    const truongIndex = db.truong.findIndex((item: any) => item.id === truongId);
    
    if (truongIndex !== -1) {
      // Kiểm tra xem có ngành nào thuộc trường này không
      const hasRelatedMajors = db.nganh.some((n: any) => n.truong_id === truongId);
      
      if (hasRelatedMajors) {
        res.status(400).json({
          success: false,
          message: 'Không thể xóa trường này vì có các ngành học liên quan',
          data: null
        });
        return;
      }
      
      // Kiểm tra xem có hồ sơ nào thuộc trường này không
      const hasRelatedApplications = db.ho_so.some((h: any) => h.truong_id === truongId);
      
      if (hasRelatedApplications) {
        res.status(400).json({
          success: false,
          message: 'Không thể xóa trường này vì có các hồ sơ xét tuyển liên quan',
          data: null
        });
        return;
      }
      
      // Xóa trường khỏi danh sách
      db.truong.splice(truongIndex, 1);
      
      // Lưu thay đổi vào db.json
      const success = writeDB(db);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Xóa trường thành công',
          data: null
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
        message: 'Không tìm thấy trường với ID cung cấp',
        data: null
      });
    }
  },

  //  thêm ngành mới
  'POST //nganh': (req: Request, res: Response) => {
    const db = readDB();
    const newNganh = req.body;
    
    // Tạo ID mới (lấy ID lớn nhất hiện tại + 1)
    const maxId = Math.max(...db.nganh.map((n: any) => n.id), 0);
    const newId = maxId + 1;
    
    // Kiểm tra trường tồn tại
    const truongExists = db.truong.some((t: any) => t.id === newNganh.truong_id);
    if (!truongExists) {
      return res.status(400).json({
        success: false,
        message: 'Trường không tồn tại',
        data: null
      });
    }
    
    // Thêm ngành mới vào db
    const nganhToAdd = {
      id: newId,
      ...newNganh
    };
    
    db.nganh.push(nganhToAdd);
    
    // Lưu thay đổi vào db.json
    const success = writeDB(db);
    
    if (success) {
      res.status(201).json({
        success: true,
        message: 'Thêm ngành thành công',
        data: nganhToAdd
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu thay đổi vào cơ sở dữ liệu',
        data: null
      });
    }
  },

  //  cập nhật thông tin ngành
  'PUT //nganh/:id': (req: Request, res: Response) => {
    const db = readDB();
    const nganhId = parseInt(req.params.id);
    const updatedNganh = req.body;
    
    const nganhIndex = db.nganh.findIndex((item: any) => item.id === nganhId);
    
    if (nganhIndex !== -1) {
      // Kiểm tra trường tồn tại
      const truongExists = db.truong.some((t: any) => t.id === updatedNganh.truong_id);
      if (!truongExists) {
        return res.status(400).json({
          success: false,
          message: 'Trường không tồn tại',
          data: null
        });
      }

      // Cập nhật thông tin ngành, giữ nguyên ID
      db.nganh[nganhIndex] = {
        ...updatedNganh,
        id: nganhId
      };
      
      // Lưu thay đổi vào db.json
      const success = writeDB(db);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Cập nhật thông tin ngành thành công',
          data: db.nganh[nganhIndex]
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
        message: 'Không tìm thấy ngành với ID cung cấp',
        data: null
      });
    }
  },

  //  xóa ngành
  'DELETE //nganh/:id': (req: Request, res: Response) => {
    const db = readDB();
    const nganhId = parseInt(req.params.id);
    
    const nganhIndex = db.nganh.findIndex((item: any) => item.id === nganhId);
    
    if (nganhIndex !== -1) {
      // Kiểm tra xem có tổ hợp xét tuyển nào thuộc ngành này không
      const hasRelatedToHop = db.to_hop_xet_tuyen.some((t: any) => t.nganh_id === nganhId);
      
      if (hasRelatedToHop) {
        res.status(400).json({
          success: false,
          message: 'Không thể xóa ngành này vì có các tổ hợp xét tuyển liên quan',
          data: null
        });
        return;
      }
      
      // Kiểm tra xem có hồ sơ nào thuộc ngành này không
      const hasRelatedApplications = db.ho_so.some((h: any) => h.nganh_id === nganhId);
      
      if (hasRelatedApplications) {
        res.status(400).json({
          success: false,
          message: 'Không thể xóa ngành này vì có các hồ sơ xét tuyển liên quan',
          data: null
        });
        return;
      }
      
      // Xóa ngành khỏi danh sách
      db.nganh.splice(nganhIndex, 1);
      
      // Lưu thay đổi vào db.json
      const success = writeDB(db);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Xóa ngành thành công',
          data: null
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
        message: 'Không tìm thấy ngành với ID cung cấp',
        data: null
      });
    }
  },

  //  lấy thông tin chi tiết ngành theo ID
  'GET //nganh/:id': (req: Request, res: Response) => {
    const db = readDB();
    const nganhId = parseInt(req.params.id);
    const nganh = db.nganh.find((item: any) => item.id === nganhId);
    
    if (nganh) {
      res.status(200).json({
        success: true,
        message: 'Lấy thông tin ngành thành công',
        data: nganh
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy ngành',
        data: null
      });
    }
  },

  //  lấy tất cả tổ hợp xét tuyển
  'GET //to_hop_xet_tuyen': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tổ hợp xét tuyển thành công',
      data: db.to_hop_xet_tuyen
    });
  },

  //  thêm tổ hợp xét tuyển cho ngành
  'POST //to_hop_xet_tuyen': (req: Request, res: Response) => {
    const db = readDB();
    const newToHop = req.body;
    
    // Tạo ID mới (lấy ID lớn nhất hiện tại + 1)
    const maxId = Math.max(...db.to_hop_xet_tuyen.map((t: any) => t.id), 0);
    const newId = maxId + 1;
    
    // Kiểm tra ngành tồn tại
    const nganhExists = db.nganh.some((n: any) => n.id === newToHop.nganh_id);
    if (!nganhExists) {
      return res.status(400).json({
        success: false,
        message: 'Ngành không tồn tại',
        data: null
      });
    }
    
    // Kiểm tra tổ hợp đã tồn tại cho ngành này chưa
    const toHopExists = db.to_hop_xet_tuyen.some(
      (t: any) => t.nganh_id === newToHop.nganh_id && t.ma_to_hop === newToHop.ma_to_hop
    );
    
    if (toHopExists) {
      return res.status(400).json({
        success: false,
        message: 'Tổ hợp này đã tồn tại cho ngành',
        data: null
      });
    }
    
    // Thêm tổ hợp mới vào db
    const toHopToAdd = {
      id: newId,
      ...newToHop
    };
    
    db.to_hop_xet_tuyen.push(toHopToAdd);
    
    // Lưu thay đổi vào db.json
    const success = writeDB(db);
    
    if (success) {
      res.status(201).json({
        success: true,
        message: 'Thêm tổ hợp xét tuyển thành công',
        data: toHopToAdd
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu thay đổi vào cơ sở dữ liệu',
        data: null
      });
    }
  },

  //  xóa tổ hợp xét tuyển
  'DELETE //to_hop_xet_tuyen/id': (req: Request, res: Response) => {
    const db = readDB();
    const toHopId = parseInt(req.params.id);
    
    const toHopIndex = db.to_hop_xet_tuyen.findIndex((item: any) => item.id === toHopId);
    
    if (toHopIndex !== -1) {
      // Xóa tổ hợp khỏi danh sách
      db.to_hop_xet_tuyen.splice(toHopIndex, 1);
      
      // Lưu thay đổi vào db.json
      const success = writeDB(db);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Xóa tổ hợp xét tuyển thành công',
          data: null
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
        message: 'Không tìm thấy tổ hợp xét tuyển với ID cung cấp',
        data: null
      });
    }
  },

  //  thêm nhiều tổ hợp xét tuyển cho ngành
  'POST //nganh/:id/to_hop_xet_tuyen': (req: Request, res: Response) => {
    const db = readDB();
    const nganhId = parseInt(req.params.id);
    const { toHopList } = req.body; // Danh sách mã tổ hợp
    
    // Kiểm tra ngành tồn tại
    const nganhExists = db.nganh.some((n: any) => n.id === nganhId);
    if (!nganhExists) {
      return res.status(400).json({
        success: false,
        message: 'Ngành không tồn tại',
        data: null
      });
    }
    
    // Xóa tất cả tổ hợp hiện tại của ngành
    const currentToHops = db.to_hop_xet_tuyen.filter((t: any) => t.nganh_id === nganhId);
    currentToHops.forEach((toHop: any) => {
      const index = db.to_hop_xet_tuyen.findIndex((t: any) => t.id === toHop.id);
      if (index !== -1) {
        db.to_hop_xet_tuyen.splice(index, 1);
      }
    });
    
    // Thêm các tổ hợp mới
    const addedToHops = [];
    let maxId = Math.max(...db.to_hop_xet_tuyen.map((t: any) => t.id), 0);
    
    for (const toHop of toHopList) {
      maxId += 1;
      const newToHop = {
        id: maxId,
        nganh_id: nganhId,
        ma_to_hop: toHop.ma_to_hop,
        cac_mon: toHop.cac_mon
      };
      
      db.to_hop_xet_tuyen.push(newToHop);
      addedToHops.push(newToHop);
    }
    
    // Lưu thay đổi vào db.json
    const success = writeDB(db);
    
    if (success) {
      res.status(200).json({
        success: true,
        message: 'Cập nhật tổ hợp xét tuyển thành công',
        data: addedToHops
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu thay đổi vào cơ sở dữ liệu',
        data: null
      });
    }
  },

  //  lấy tất cả các mã tổ hợp có sẵn (định nghĩa sẵn)
  'GET //to_hop': (req: Request, res: Response) => {
    // Danh sách tổ hợp xét tuyển phổ biến
    const toHopOptions = [
      { ma_to_hop: 'A00', cac_mon: 'Toán+Lý+Hóa' },
      { ma_to_hop: 'A01', cac_mon: 'Toán+Lý+Anh' },
      { ma_to_hop: 'A02', cac_mon: 'Toán+Lý+Sinh' },
      { ma_to_hop: 'A03', cac_mon: 'Toán+Lý+Văn' },
      { ma_to_hop: 'B00', cac_mon: 'Toán+Hóa+Sinh' },
      { ma_to_hop: 'B01', cac_mon: 'Toán+Hóa+Anh' },
      { ma_to_hop: 'B02', cac_mon: 'Toán+Hóa+Văn' },
      { ma_to_hop: 'B03', cac_mon: 'Toán+Sinh+Văn' },
      { ma_to_hop: 'C00', cac_mon: 'Văn+Sử+Địa' },
      { ma_to_hop: 'C01', cac_mon: 'Văn+Toán+Lý' },
      { ma_to_hop: 'C02', cac_mon: 'Văn+Toán+Hóa' },
      { ma_to_hop: 'C03', cac_mon: 'Văn+Toán+Sử' },
      { ma_to_hop: 'C04', cac_mon: 'Văn+Toán+Địa' },
      { ma_to_hop: 'D01', cac_mon: 'Toán+Văn+Anh' },
      { ma_to_hop: 'D02', cac_mon: 'Toán+Văn+Nga' },
      { ma_to_hop: 'D03', cac_mon: 'Toán+Văn+Pháp' },
      { ma_to_hop: 'D04', cac_mon: 'Toán+Văn+Trung' },
      { ma_to_hop: 'D05', cac_mon: 'Toán+Văn+Đức' },
      { ma_to_hop: 'D06', cac_mon: 'Toán+Văn+Nhật' },
      { ma_to_hop: 'D07', cac_mon: 'Toán+Hóa+Anh' },
      { ma_to_hop: 'D08', cac_mon: 'Toán+Sinh+Anh' },
      { ma_to_hop: 'D14', cac_mon: 'Văn+Anh+GDCD' }
    ];
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tổ hợp xét tuyển thành công',
      data: toHopOptions
    });
  }
}; 