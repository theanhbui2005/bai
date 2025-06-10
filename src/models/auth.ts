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
  };
}; 