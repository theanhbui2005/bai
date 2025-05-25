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

/**
 * Lấy chi tiết ngành theo ID
 */
export const getNganhById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/nganh/${id}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as NganhType,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi lấy thông tin ngành',
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
 * Thêm ngành mới
 */
export const addNganh = async (nganhData: Omit<NganhType, 'id'>) => {
  try {
    const response = await axios.post(`${API_URL}/nganh`, nganhData);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as NganhType,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi thêm ngành',
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
 * Cập nhật thông tin ngành
 */
export const updateNganh = async (id: number, nganhData: Omit<NganhType, 'id'>) => {
  try {
    const response = await axios.put(`${API_URL}/nganh/${id}`, nganhData);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as NganhType,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi cập nhật thông tin ngành',
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
 * Xóa ngành
 */
export const deleteNganh = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/nganh/${id}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: null,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi xóa ngành',
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
 * Lấy danh sách tổ hợp xét tuyển định sẵn
 */
export const getToHopOptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/to-hop-options`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
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

/**
 * Cập nhật tổ hợp xét tuyển cho ngành
 */
export const updateToHopForNganh = async (nganhId: number, toHopList: { ma_to_hop: string; cac_mon: string }[]) => {
  try {
    const response = await axios.post(`${API_URL}/nganh/${nganhId}/to-hop`, { toHopList });
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data as ToHopType[],
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi cập nhật tổ hợp xét tuyển',
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
 * Xóa tổ hợp xét tuyển
 */
export const deleteToHop = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/to-hop/${id}`);
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: null,
      };
    }
    return {
      success: false,
      message: response.data.message || 'Có lỗi xảy ra khi xóa tổ hợp xét tuyển',
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