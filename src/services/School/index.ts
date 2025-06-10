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
<<<<<<< HEAD
    const response = await axios.get(`${API_URL}/schools`);
    return {
      success: true,
      message: 'Lấy danh sách trường thành công',
      data: response.data as TruongType[],
=======
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
>>>>>>> theanh2
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

/**
 * Thêm trường mới
 */
export const addSchool = async (schoolData: Omit<TruongType, 'id'>) => {
  try {
    const response = await axios.post(`${API_URL}/truong`, schoolData);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as TruongType,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi thêm trường',
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
 * Cập nhật thông tin trường
 */
export const updateSchool = async (id: number, schoolData: Omit<TruongType, 'id'>) => {
  try {
    const response = await axios.put(`${API_URL}/truong/${id}`, schoolData);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as TruongType,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi cập nhật thông tin trường',
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
 * Xóa trường
 */
export const deleteSchool = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/truong/${id}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: null,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi xóa trường',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi kết nối đến máy chủ',
      data: null,
    };
  }
<<<<<<< HEAD
};
=======
}; 
>>>>>>> theanh2
