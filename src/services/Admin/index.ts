import axios from 'axios';

// Sử dụng API proxy của UMI thay vì gọi trực tiếp đến json-server
const API_URL = '/api';

export const loginAdmin = async (credentials: { username: string; password: string }) => {
  try {
    // Sử dụng POST /api/login thay vì GET và tìm kiếm
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    if (response.data.success) {
      // Trả về thông tin admin từ API
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Đăng nhập thành công'
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.data.message || 'Tên đăng nhập hoặc mật khẩu không đúng'
      };
    }
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
    const response = await axios.get(`${API_URL}/admin/${id}`);
    const { password, ...adminInfo } = response.data;
    return {
      success: true,
      data: adminInfo
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'Không thể lấy thông tin quản trị viên'
    };
  }
}; 