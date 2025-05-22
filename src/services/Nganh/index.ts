import axios from 'axios';

// Interface cho ngành đào tạo
export interface NganhType {
  id: number;
  truong_id: number;
  ma_nganh: string;
  ten_nganh: string;
  mo_ta: string;
}

// Interface cho tổ hợp xét tuyển
export interface ToHopType {
  id: number;
  nganh_id: number;
  ma_to_hop: string;
  cac_mon: string;
}

const API_URL = '/api';

/**
 * Lấy danh sách ngành theo trường
 */
export const getNganhByTruongId = async (truongId: number) => {
  try {
    const response = await axios.get(`${API_URL}/nganh/truong/${truongId}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as NganhType[],
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy danh sách ngành',
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
 * Lấy danh sách tổ hợp xét tuyển theo ngành
 */
export const getToHopByNganhId = async (nganhId: number) => {
  try {
    const response = await axios.get(`${API_URL}/to-hop/nganh/${nganhId}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as ToHopType[],
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy danh sách tổ hợp xét tuyển',
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