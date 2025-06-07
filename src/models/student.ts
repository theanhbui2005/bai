import { useState } from 'react';
import { StudentType, loginStudent, registerStudent } from '@/services/Student';

export default function useStudent() {
  const [studentInfo, setStudentInfo] = useState<StudentType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginStudent(username, password);
      if (result.success) {
        setStudentInfo(result.data);
        setIsLoggedIn(true);
        localStorage.setItem('studentInfo', JSON.stringify(result.data));
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (values: Omit<StudentType, 'id'>) => {
    setLoading(true);
    try {
      const result = await registerStudent(values);
      return result.success;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('studentInfo');
    setStudentInfo(null);
    setIsLoggedIn(false);
  };

  const checkLoginStatus = () => {
    const savedInfo = localStorage.getItem('studentInfo');
    if (savedInfo) {
      setStudentInfo(JSON.parse(savedInfo));
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  return {
    studentInfo,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
    checkLoginStatus
  };
}
