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

/**
 * Lấy danh sách ngành theo trường
 */
export const getNganhByTruongId = async (truongId: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/nganh?truong_id=${truongId}`);
    return {
      success: true, 
      message: "Lấy danh sách ngành thành công",
      data: response.data as NganhType[],
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
    const response = await axios.get(`http://localhost:3000/to_hop_xet_tuyen?nganh_id=${nganhId}`);
    return {
      success: true,
      message: "Lấy danh sách tổ hợp xét tuyển thành công",
      data: response.data as ToHopType[],
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
    const response = await axios.get(`http://localhost:3000/nganh/${id}`);
    return {
      success: true,
      message: "Lấy thông tin ngành thành công", 
      data: response.data as NganhType,
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
    const response = await axios.post(`http://localhost:3000/nganh`, nganhData);
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
    const response = await axios.put(`http://localhost:3000/nganh/${id}`, nganhData);
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
    const response = await axios.delete(`http://localhost:3000/nganh/${id}`);
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
 * Cập nhật tổ hợp xét tuyển cho ngành
 */
export const updateToHopForNganh = async (nganh_id: number, toHopList: { ma_to_hop: string; cac_mon: string }[]) => {
  try {
    // Delete existing to_hop for this nganh first
    const existing = await axios.get(`http://localhost:3000/to_hop_xet_tuyen?nganh_id=${nganh_id}`);
    await Promise.all(existing.data.map((item: { id: any; }) => 
      axios.delete(`http://localhost:3000/to_hop_xet_tuyen/${item.id}`)
    ));
    
    // Add new to_hop entries
    const newEntries = await Promise.all(toHopList.map(toHop => 
      axios.post(`http://localhost:3000/to_hop_xet_tuyen`, {
        nganh_id,
        ...toHop
      })
    ));

    return {
      success: true,
      message: 'Cập nhật tổ hợp xét tuyển thành công',
      data: newEntries.map(res => res.data) as ToHopType[],
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
    await axios.delete(`http://localhost:3000/to_hop_xet_tuyen/${id}`);
    return {
      success: true,
      message: 'Xóa tổ hợp xét tuyển thành công',
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