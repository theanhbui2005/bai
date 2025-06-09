import axios from 'axios';

export interface AdminType {
  id: number;
  username: string; 
  password?: string;
  ho_ten: string;
  email: string;
  role: string;
  trang_thai: string;
}

export const loginAdmin = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.get(`http://localhost:3000/admin?username=${credentials.username}`);
    const admin = response.data[0];
    
    if (admin && admin.password === credentials.password) {
      const { password, ...adminInfo } = admin;
      return {
        success: true,
        data: adminInfo,
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

export const getAdminInfo = async (id: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/admin/${id}`);
    const { password, ...adminInfo } = response.data;
    return {
      success: true,
      data: adminInfo,
      message: 'Lấy thông tin admin thành công'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'Không thể lấy thông tin quản trị viên'
    };
  }
};