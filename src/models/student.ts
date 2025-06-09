import { useState } from 'react';
import { message } from 'antd';
import { loginStudent, StudentType } from '@/services/Student/auth';

export default () => {
  const [studentInfo, setStudentInfo] = useState<StudentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check login status from localStorage
  const checkLoginStatus = () => {
    const studentData = localStorage.getItem('studentInfo');
    if (studentData) {
      setStudentInfo(JSON.parse(studentData));
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  // Login
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginStudent({ username, password });
      
      if (result.success) {
        setStudentInfo(result.data);
        setIsLoggedIn(true);
        
        // Save to localStorage
        localStorage.setItem('studentInfo', JSON.stringify(result.data));
        
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

  // Logout
  const logout = () => {
    localStorage.removeItem('studentInfo');
    setStudentInfo(null);
    setIsLoggedIn(false);
    message.success('Đăng xuất thành công');
  };

  return {
    studentInfo,
    loading,
    isLoggedIn,
    login,
    logout,
    checkLoginStatus,
  };
};
