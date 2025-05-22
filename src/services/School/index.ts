import axios from 'axios';

// Interface cho Trường đại học
export interface TruongType {
  id: number;
  ma_truong: string;
  ten_truong: string;
  dia_chi: string;
  loai_truong: string;
}

// API URL
const API_URL = '/api';

/**
 * Lấy danh sách tất cả các trường
 */
export const getAllSchools = async () => {
  try {
    const response = await axios.get(`${API_URL}/truong`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as TruongType[],
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy danh sách trường',
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
 * Lấy thông tin chi tiết của một trường theo ID
 */
export const getSchoolById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/truong/${id}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as TruongType,
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