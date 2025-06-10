import { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { history } from 'umi';

// Định nghĩa kiểu dữ liệu cho người dùng
interface UserInfo {
  id: number;
  username?: string;
  ho_ten: string;
  email?: string;
  role: 'admin' | 'student';
  trang_thai?: string;
}

// Interface cho thông tin đăng ký
interface RegisterInfo {
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  email: string;
  sdt: string;
}

export default () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'student' | null>(null);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi khởi động
  const checkLoginStatus = () => {
    const adminData = localStorage.getItem('adminInfo');
    const userData = localStorage.getItem('userInfo');
    
    if (adminData) {
      const admin = JSON.parse(adminData);
      setUserInfo(admin);
      setUserRole('admin');
      setIsLoggedIn(true);
      return { loggedIn: true, role: 'admin' };
    } else if (userData) {
      const user = JSON.parse(userData);
      setUserInfo(user);
      setUserRole('student');
      setIsLoggedIn(true);
      return { loggedIn: true, role: 'student' };
    }
    return { loggedIn: false, role: null };
  };

  // Hàm đăng ký thí sinh
  const register = async (registerData: RegisterInfo) => {
    try {
      // Kiểm tra xem email đã tồn tại chưa
      try {
        const response = await axios.get('/api/ho-so');
        if (response.data && response.data.data) {
          const studentList = response.data.data;
          
          // Kiểm tra email đã tồn tại chưa
          const existingEmail = studentList.find(
            (s: any) => s.email === registerData.email
          );
          
          if (existingEmail) {
            message.error('Email đã được sử dụng. Vui lòng sử dụng email khác.');
            return { success: false };
          }
          
          // Kiểm tra số CCCD đã tồn tại chưa
          const existingCCCD = studentList.find(
            (s: any) => s.so_cccd === registerData.so_cccd
          );
          
          if (existingCCCD) {
            message.error('Số CCCD đã được đăng ký. Vui lòng kiểm tra lại.');
            return { success: false };
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra dữ liệu:", error);
        message.error('Có lỗi xảy ra khi kiểm tra thông tin. Vui lòng thử lại sau.');
        return { success: false };
      }
      
      // Tạo hồ sơ mới cho thí sinh
      const newHoSo = {
        // Các trường cơ bản từ form đăng ký
        ho_ten: registerData.ho_ten,
        ngay_sinh: registerData.ngay_sinh,
        gioi_tinh: registerData.gioi_tinh,
        so_cccd: registerData.so_cccd,
        email: registerData.email,
        sdt: registerData.sdt,
        
        // Giá trị mặc định cho các trường khác
        diem_thi: 0, // Sẽ được cập nhật khi thí sinh nộp điểm
        doi_tuong_uu_tien: "",
        truong_id: 0, // Chưa chọn trường
        nganh_id: 0, // Chưa chọn ngành
        file_minh_chung: "",
        trang_thai: "moi_dang_ky",
        ngay_gui: new Date().toISOString(),
        ghi_chu: "Tài khoản mới đăng ký"
      };
      
      // Gửi yêu cầu tạo hồ sơ mới
      try {
        const response = await axios.post('/api/ho-so', newHoSo);
        
        if (response.data && response.data.success) {
          message.success('Đăng ký thành công! Bạn có thể đăng nhập với email hoặc CCCD của mình.');
          return { success: true };
        } else {
          message.error('Đăng ký thất bại. Vui lòng thử lại sau.');
          return { success: false };
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        message.error('Đăng ký thất bại. Vui lòng thử lại sau.');
        return { success: false };
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      return { success: false };
    }
  };

  // Hàm đăng nhập
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Cách đơn giản: Kiểm tra cứng tài khoản admin
      if (username === 'admin' && password === 'admin123') {
        // Thông tin admin từ db.json
        const adminInfo = {
          id: 1,
          username: 'admin',
          ho_ten: 'Quản Trị Viên',
          email: 'admin@example.com',
          role: 'admin' as const,
          trang_thai: 'active'
        };
        
        setUserInfo(adminInfo);
        setUserRole('admin');
        setIsLoggedIn(true);
        
        // Lưu thông tin vào localStorage để duy trì đăng nhập
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
        
        message.success('Đăng nhập quản trị viên thành công');
        
        // Chuyển hướng đến trang dashboard admin
        setTimeout(() => {
          history.push('/admin/dashboard');
          window.location.reload(); // Đảm bảo trang được tải lại hoàn toàn
        }, 300);
        
        return { success: true, role: 'admin' };
      }
      
      // Kiểm tra thí sinh (sử dụng API để lấy danh sách thí sinh)
      try {
        const response = await axios.get('/api/ho-so');
        if (response.data && response.data.data) {
          const studentList = response.data.data;
          
          // Tìm thí sinh với email/CCCD và mật khẩu
          const student = studentList.find(
            (s: any) => (s.email === username || s.so_cccd === username) && s.so_cccd === password
          );
          
          if (student) {
            // Đăng nhập thí sinh thành công
            const studentInfo: UserInfo = {
              id: student.id,
              ho_ten: student.ho_ten,
              email: student.email,
              role: 'student',
            };
            
            setUserInfo(studentInfo);
            setUserRole('student');
            setIsLoggedIn(true);
            
            // Lưu thông tin vào localStorage
            localStorage.setItem('userInfo', JSON.stringify(studentInfo));
            
            message.success('Đăng nhập thí sinh thành công');
            
            // Chuyển hướng đến trang hồ sơ thí sinh - đảm bảo đúng đường dẫn
            setTimeout(() => {
              history.push('/student/profile');
              window.location.reload(); // Đảm bảo trang được tải lại hoàn toàn
            }, 300);
            
            return { success: true, role: 'student' };
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hồ sơ:", error);
      }
      
      // Nếu không đăng nhập được
      message.error('Tên đăng nhập hoặc mật khẩu không đúng');
      return { success: false, role: null };
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      message.error('Đăng nhập thất bại');
      return { success: false, role: null };
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('userInfo');
    
    // Cập nhật state
    setUserInfo(null);
    setUserRole(null);
    setIsLoggedIn(false);
    
    // Hiển thị thông báo
    message.success('Đăng xuất thành công');
    
    // Chuyển hướng về trang đăng nhập
    history.push('/user/login');
    
    // Reload trang để làm mới hoàn toàn ứng dụng
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return {
    userInfo,
    userRole,
    loading,
    isLoggedIn,
    login,
    logout,
    checkLoginStatus,
    register,
  };
}; 