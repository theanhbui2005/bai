import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getStudentProfileByEmail = async (email: string): Promise<Student.ApiResponse<Student.HoSo>> => {
  try {
    const response = await axios.get<Student.ApiResponse<Student.HoSo[]>>(`${API_URL}/ho_so`);
    if (response.data && response.data.success) {
      const studentHoSo = response.data.data?.find(item => item.email === email);
      
      return studentHoSo
        ? {
            success: true,
            message: 'Lấy thông tin hồ sơ thành công',
            data: studentHoSo,
          }
        : {
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

export const getSchoolById = async (id: number): Promise<Student.ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API_URL}/truong/${id}`);
    return response.data?.success
      ? {
          success: true,
          message: 'Lấy thông tin trường thành công',
          data: response.data.data,
        }
      : {
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

export const getMajorById = async (id: number): Promise<Student.ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API_URL}/nganh/${id}`);
    return response.data?.success
      ? {
          success: true,
          message: 'Lấy thông tin ngành học thành công',
          data: response.data.data,
        }
      : {
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