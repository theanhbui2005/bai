import axios from 'axios';

// Interface cho Hồ sơ Thí sinh
export interface HoSoType {
  id: number;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  email: string;
  sdt: string;
  diem_thi: number;
  doi_tuong_uu_tien: string;
  truong_id: number;
  nganh_id: number;
  file_minh_chung: string;
  trang_thai: string;
  ngay_gui: string;
  ghi_chu?: string;
}

// API URL
const API_URL = '/api';

/**
 * Lấy thông tin hồ sơ thí sinh theo email
 */
export const getStudentProfileByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/ho-so`);
    if (response.data && response.data.success) {
      const hoSoList = response.data.data;
      const studentHoSo = hoSoList.find((item: HoSoType) => item.email === email);
      
      if (studentHoSo) {
        return {
          success: true,
          message: 'Lấy thông tin hồ sơ thành công',
          data: studentHoSo as HoSoType,
        };
      }
      
      return {
        success: false,
        message: 'Không tìm thấy hồ sơ của bạn',
        data: null,
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy thông tin hồ sơ',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi kết nối đến máy chủ',
      data: null,
    };
  }
};

/**
 * Lấy thông tin trường đại học theo ID
 */
export const getSchoolById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/truong/${id}`);
    if (response.data && response.data.success) {
      return {
        success: true,
        message: 'Lấy thông tin trường thành công',
        data: response.data.data,
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy thông tin trường',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi kết nối đến máy chủ',
      data: null,
    };
  }
};

/**
 * Lấy thông tin ngành học theo ID
 */
export const getMajorById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/nganh/${id}`);
    if (response.data && response.data.success) {
      return {
        success: true,
        message: 'Lấy thông tin ngành học thành công',
        data: response.data.data,
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy thông tin ngành học',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi kết nối đến máy chủ',
      data: null,
    };
  }
}; 