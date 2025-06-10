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
  
  // API kiểm tra đăng nhập admin trực tiếp
  'POST /api/admin/login': (req: Request, res: Response) => {
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

  // API đăng ký thí sinh mới
  'POST /api/ho-so': (req: Request, res: Response) => {
    console.log("Nhận yêu cầu đăng ký thí sinh mới:", req.body);
    const db = readDB();
    const hoSoData = req.body;
    
    // Kiểm tra email đã tồn tại
    const existingEmail = db.ho_so.find((item: any) => item.email === hoSoData.email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng. Vui lòng sử dụng email khác.',
        data: null
      });
    }
    
    // Kiểm tra số CCCD đã tồn tại
    const existingCCCD = db.ho_so.find((item: any) => item.so_cccd === hoSoData.so_cccd);
    if (existingCCCD) {
      return res.status(400).json({
        success: false,
        message: 'Số CCCD đã được đăng ký. Vui lòng kiểm tra lại.',
        data: null
      });
    }
    
    // Kiểm tra to_hop_id có hợp lệ
    if (hoSoData.to_hop_id && hoSoData.to_hop_id !== 0) {
      // Kiểm tra tổ hợp có tồn tại không
      const toHopExists = db.to_hop_xet_tuyen.some((item: any) => item.id === hoSoData.to_hop_id);
      if (!toHopExists) {
        return res.status(400).json({
          success: false,
          message: 'Tổ hợp xét tuyển không hợp lệ.',
          data: null
        });
      }
      
      // Kiểm tra tổ hợp có phù hợp với ngành không
      if (hoSoData.nganh_id && hoSoData.nganh_id !== 0) {
        const toHopMatches = db.to_hop_xet_tuyen.some(
          (item: any) => item.id === hoSoData.to_hop_id && item.nganh_id === hoSoData.nganh_id
        );
        if (!toHopMatches) {
          return res.status(400).json({
            success: false,
            message: 'Tổ hợp xét tuyển không phù hợp với ngành đã chọn.',
            data: null
          });
        }
      }
    }
    
    // Tạo ID mới cho hồ sơ
    const newId = db.ho_so.length > 0 ? Math.max(...db.ho_so.map((item: any) => item.id)) + 1 : 1;
    
    // Tạo hồ sơ mới
    const newHoSo = {
      id: newId,
      ...hoSoData,
      to_hop_id: hoSoData.to_hop_id || 0, // Đảm bảo có trường to_hop_id
    };
    
    // Thêm hồ sơ vào danh sách
    db.ho_so.push(newHoSo);
    
    // Lưu thay đổi vào db.json
    const success = writeDB(db);
    
    if (success) {
      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: newHoSo
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu thông tin đăng ký',
        data: null
      });
    }
  },

  // API cập nhật thông tin hồ sơ thí sinh
  'PUT /api/ho-so/:id': (req: Request, res: Response) => {
    console.log("Nhận yêu cầu cập nhật hồ sơ thí sinh:", req.body);
    const db = readDB();
    const hoSoId = parseInt(req.params.id);
    const hoSoData = req.body;
    
    // Kiểm tra hồ sơ tồn tại
    const hoSoIndex = db.ho_so.findIndex((item: any) => item.id === hoSoId);
    if (hoSoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ với ID cung cấp',
        data: null
      });
    }
    
    // Kiểm tra email đã tồn tại (trừ email của chính hồ sơ này)
    if (hoSoData.email) {
      const existingEmail = db.ho_so.find(
        (item: any) => item.email === hoSoData.email && item.id !== hoSoId
      );
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng bởi thí sinh khác',
          data: null
        });
      }
    }
    
    // Kiểm tra CCCD đã tồn tại (trừ CCCD của chính hồ sơ này)
    if (hoSoData.so_cccd) {
      const existingCCCD = db.ho_so.find(
        (item: any) => item.so_cccd === hoSoData.so_cccd && item.id !== hoSoId
      );
      if (existingCCCD) {
        return res.status(400).json({
          success: false,
          message: 'Số CCCD đã được đăng ký bởi thí sinh khác',
          data: null
        });
      }
    }
    
    // Kiểm tra to_hop_id có hợp lệ nếu được cung cấp
    if (hoSoData.to_hop_id !== undefined && hoSoData.to_hop_id !== 0) {
      // Kiểm tra tổ hợp có tồn tại không
      const toHopExists = db.to_hop_xet_tuyen.some((item: any) => item.id === hoSoData.to_hop_id);
      if (!toHopExists) {
        return res.status(400).json({
          success: false,
          message: 'Tổ hợp xét tuyển không hợp lệ.',
          data: null
        });
      }
      
      // Kiểm tra tổ hợp có phù hợp với ngành không
      const nganhId = hoSoData.nganh_id !== undefined ? hoSoData.nganh_id : db.ho_so[hoSoIndex].nganh_id;
      if (nganhId && nganhId !== 0) {
        const toHopMatches = db.to_hop_xet_tuyen.some(
          (item: any) => item.id === hoSoData.to_hop_id && item.nganh_id === nganhId
        );
        if (!toHopMatches) {
          return res.status(400).json({
            success: false,
            message: 'Tổ hợp xét tuyển không phù hợp với ngành đã chọn.',
            data: null
          });
        }
      }
    }
    
    // Giữ lại ID và các trường không được phép cập nhật
    const updatedHoSo = {
      ...db.ho_so[hoSoIndex],    // Giữ lại các trường cũ
      ...hoSoData,               // Cập nhật các trường mới
      id: hoSoId,                // Đảm bảo ID không đổi
      // Giữ nguyên các trường không được phép thay đổi
      trang_thai: db.ho_so[hoSoIndex].trang_thai,
      ngay_gui: db.ho_so[hoSoIndex].ngay_gui,
      ghi_chu: db.ho_so[hoSoIndex].ghi_chu,
    };
    
    // Cập nhật hồ sơ
    db.ho_so[hoSoIndex] = updatedHoSo;
    
    // Lưu thay đổi vào db.json
    const success = writeDB(db);
    
    if (success) {
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin hồ sơ thành công',
        data: updatedHoSo
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu thay đổi vào cơ sở dữ liệu',
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

  // API thêm trường mới
  'POST /api/truong': (req: Request, res: Response) => {
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

  // API cập nhật thông tin trường
  'PUT /api/truong/:id': (req: Request, res: Response) => {
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

  // API xóa trường
  'DELETE /api/truong/:id': (req: Request, res: Response) => {
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

  // API thêm ngành mới
  'POST /api/nganh': (req: Request, res: Response) => {
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

  // API cập nhật thông tin ngành
  'PUT /api/nganh/:id': (req: Request, res: Response) => {
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

  // API xóa ngành
  'DELETE /api/nganh/:id': (req: Request, res: Response) => {
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

  // API lấy thông tin chi tiết ngành theo ID
  'GET /api/nganh/:id': (req: Request, res: Response) => {
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

  // API lấy tất cả tổ hợp xét tuyển
  'GET /api/to-hop': (req: Request, res: Response) => {
    const db = readDB();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tổ hợp xét tuyển thành công',
      data: db.to_hop_xet_tuyen
    });
  },

  // API thêm tổ hợp xét tuyển cho ngành
  'POST /api/to-hop': (req: Request, res: Response) => {
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

  // API xóa tổ hợp xét tuyển
  'DELETE /api/to-hop/:id': (req: Request, res: Response) => {
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

  // API thêm nhiều tổ hợp xét tuyển cho ngành
  'POST /api/nganh/:id/to-hop': (req: Request, res: Response) => {
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

  // API lấy tất cả các mã tổ hợp có sẵn (định nghĩa sẵn)
  'GET /api/to-hop-options': (req: Request, res: Response) => {
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
  },

  // API lấy chi tiết tổ hợp xét tuyển theo ID
  'GET /api/to-hop/:id': (req: Request, res: Response) => {
    const db = readDB();
    const toHopId = parseInt(req.params.id);
    const toHop = db.to_hop_xet_tuyen.find((item: any) => item.id === toHopId);
    
    if (toHop) {
      res.status(200).json({
        success: true,
        message: 'Lấy thông tin tổ hợp xét tuyển thành công',
        data: toHop
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy tổ hợp xét tuyển',
        data: null
      });
    }
  },

  // API upload file minh chứng
  'POST /api/upload-minh-chung': (req: Request, res: Response) => {
    try {
      // Trong môi trường mock, chúng ta giả lập việc upload file
      // Thông thường sẽ xử lý upload thật và trả về đường dẫn
      
      // Trích xuất tên file từ yêu cầu
      const fileName = req.body.fileName || `file_${Date.now()}.pdf`;
      
      // Tạo đường dẫn giả định cho file đã upload
      const filePath = `uploads/${fileName}`;
      
      // Log thông tin
      console.log(`Giả lập upload file: ${filePath}`);
      
      // Trả về kết quả thành công với đường dẫn file
      setTimeout(() => {
        res.status(200).json({
          success: true,
          message: 'Upload minh chứng thành công',
          data: {
            filePath: filePath,
            fileName: fileName
          }
        });
      }, 1000); // Giả lập độ trễ 1 giây để tạo cảm giác đang upload
    } catch (error) {
      console.error('Lỗi khi xử lý upload file:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể upload file minh chứng',
        data: null
      });
    }
  },
  
  // API xóa file minh chứng
  'DELETE /api/minh-chung/:filename': (req: Request, res: Response) => {
    try {
      // Trong môi trường mock, chúng ta giả lập việc xóa file
      
      // Trích xuất tên file từ tham số đường dẫn
      const fileName = req.params.filename;
      
      // Log thông tin
      console.log(`Giả lập xóa file: uploads/${fileName}`);
      
      // Trả về kết quả thành công
      res.status(200).json({
        success: true,
        message: 'Xóa minh chứng thành công',
        data: null
      });
    } catch (error) {
      console.error('Lỗi khi xử lý xóa file:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể xóa file minh chứng',
        data: null
      });
    }
  },
}; 