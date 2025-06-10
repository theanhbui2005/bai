import { useState, useCallback } from 'react';
import { history } from 'umi';
import { message } from 'antd';

export default () => {
  const [user, setUser] = useState<any>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/admin');
      const users = await response.json();
      const matchedUser = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (matchedUser) {
        setUser(matchedUser);
        localStorage.setItem('user', JSON.stringify(matchedUser));
        history.push(matchedUser.role === 'admin' ? '/admin/applications' : '/student/application');
        return true;
      }
      message.error('Invalid username or password');
      return false;
    } catch (error) {
      message.error('Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    history.push('/user/login');
  }, []);

  return { user, login, logout };
};
