import axios from 'axios';

export interface StudentType {
  id: number;
  username: string;
  password: string;
  ho_ten: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
}

const API_URL = '/api';

/**
 * Đăng ký tài khoản thí sinh
 */
export const registerStudent = async (data: Omit<StudentType, 'id'>) => {
  try {
    const response = await axios.post(`${API_URL}/students/register`, data);
    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng ký tài khoản',
      data: null
    };
  }
};

/**
 * Đăng nhập tài khoản thí sinh
 */
export const loginStudent = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/students/login`, { username, password });
    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      data: null
    };
  }
};

/**
 * Cập nhật thông tin thí sinh
 */
export const updateStudent = async (id: number, data: Partial<Omit<StudentType, 'id'>>) => {
  try {
    const response = await axios.put(`${API_URL}/students/${id}`, data);
    return {
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật thông tin',
      data: null
    };
  }
};
