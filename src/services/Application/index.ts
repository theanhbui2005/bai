import axios from 'axios';

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

/**
 * Lấy danh sách tất cả hồ sơ
 */
export const getAllApplications = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/ho_so`);
    return {
      success: true,
      message: 'Lấy danh sách hồ sơ thành công',
      data: response.data as HoSoType[],
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
    const response = await axios.get(`http://localhost:3000/ho_so/${id}`);
    return {
      success: true,
      message: 'Lấy thông tin hồ sơ thành công',
      data: response.data as HoSoType,
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
    const response = await axios.patch(`http://localhost:3000/ho_so/${id}`, {
      trang_thai,
      ghi_chu: ghi_chu || '',
    });
    return {
      success: true,
      message: 'Cập nhật trạng thái hồ sơ thành công',
      data: response.data as HoSoType,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi kết nối đến máy chủ',
      data: null,
    };
  }
};