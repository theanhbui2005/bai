import axios from 'axios';

export interface StudentType {
  id: number;
  username: string;
  password?: string;
  ho_ten: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  status: 'active' | 'inactive';
}

const API_URL = 'http://localhost:3000';

export const loginStudent = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.get(`${API_URL}/students?username=${credentials.username}`);
    const student = response.data[0];
    
    if (student && student.password === credentials.password) {
      const { password, ...studentInfo } = student;
      return {
        success: true,
        data: studentInfo,
        message: 'Đăng nhập thành công'
      };
    }
    return {
      success: false,
      data: null,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng'
    };
  } catch (error) {
    return {
      success: false,
      data: null, 
      message: 'Lỗi kết nối đến server'
    };
  }
};

export const registerStudent = async (studentData: Omit<StudentType, 'id' | 'status'>) => {
  try {
    // Check if username or email exists
    const existingUser = await axios.get(`${API_URL}/students?username=${studentData.username}`);
    if (existingUser.data.length > 0) {
      return {
        success: false,
        message: 'Tên đăng nhập đã tồn tại',
        data: null
      };
    }

    const response = await axios.post(`${API_URL}/students`, {
      ...studentData,
      status: 'active'
    });

    return {
      success: true,
      message: 'Đăng ký thành công',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi khi đăng ký tài khoản',
      data: null
    };
  }
};
