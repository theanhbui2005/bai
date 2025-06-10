import axios from 'axios';

// Interface cho hồ sơ
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
  trang_thai: 'cho_duyet' | 'da_duyet' | 'tu_choi';
  ngay_gui: string;
  ghi_chu: string;
}

const API_URL = '/api';

/**
 * Lấy danh sách tất cả hồ sơ
 */
export const getAllApplications = async () => {
  try {
    const response = await axios.get(`${API_URL}/ho-so`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as HoSoType[],
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy danh sách hồ sơ',
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi kết nối đến máy chủ',
      data: [],
    };
  }
};

/**
 * Lấy chi tiết hồ sơ theo ID
 */
export const getApplicationById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/ho-so/${id}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as HoSoType,
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
 * Cập nhật trạng thái hồ sơ
 */
export const updateApplicationStatus = async (
  id: number,
  trang_thai: 'cho_duyet' | 'da_duyet' | 'tu_choi',
  ghi_chu?: string
) => {
  try {
    const response = await axios.patch(`${API_URL}/ho-so/${id}/status`, {
      trang_thai,
      ghi_chu: ghi_chu || '',
    });
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as HoSoType,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi cập nhật trạng thái hồ sơ',
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