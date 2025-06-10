import { useState } from 'react';
import { loginAdmin, getAdminInfo } from '@/services/Admin';
import { message } from 'antd';

interface AdminInfo {
  id: number;
  username: string;
  ho_ten: string;
  email: string;
  role: string;
  trang_thai: string;
}

export default () => {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi khởi động
  const checkLoginStatus = () => {
    const adminData = localStorage.getItem('adminInfo');
    if (adminData) {
      setAdminInfo(JSON.parse(adminData));
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  // Hàm đăng nhập
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginAdmin({ username, password });
      
      if (result.success) {
        setAdminInfo(result.data);
        setIsLoggedIn(true);
        
        // Lưu thông tin vào localStorage để duy trì đăng nhập
        localStorage.setItem('adminInfo', JSON.stringify(result.data));
        
        message.success(result.message);
        return true;
      } else {
        message.error(result.message);
        return false;
      }
    } catch (error) {
      message.error('Đăng nhập thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('adminInfo');
    setAdminInfo(null);
    setIsLoggedIn(false);
    message.success('Đăng xuất thành công');
  };

  return {
    adminInfo,
    loading,
    isLoggedIn,
    login,
    logout,
    checkLoginStatus,
  };
}; 