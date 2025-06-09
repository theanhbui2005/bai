import axios from 'axios';
import { HoSoType } from '../Application';
import { API_URL } from '../config';

// Add retry functionality
// const axiosWithRetry = axios.create({
//   baseURL: API_URL,
//   timeout: 5000
// });
const API_URL = 'http://localhost:3000';
interface StudentProfileResponse {
  success: boolean;
  data: any;
  message: string;
}

export const getStudentProfile = async (studentId: number, retries = 3): Promise<StudentProfileResponse> => {
  try {
    const response = await axiosWithRetry.get(`/students/${studentId}`);
    return {
      success: true,
      data: response.data,
      message: 'Lấy thông tin thành công'
    };
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 404) {
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getStudentProfile(studentId, retries - 1);
    }
    
    return {
      success: false,
      data: null,
      message: `Lỗi khi lấy thông tin: ${error.response?.status === 404 ? 'Không tìm thấy dữ liệu' : 'Lỗi kết nối'}`
    };
  }
};

export const submitApplication = async (applicationData: Omit<HoSoType, 'id' | 'ngay_gui' | 'trang_thai'>) => {
  try {
    const response = await axios.post(`${API_URL}/ho_so`, {
      ...applicationData,
      ngay_gui: new Date().toISOString(),
      trang_thai: 'cho_duyet'
    });

    return {
      success: true,
      message: 'Gửi hồ sơ thành công',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi khi gửi hồ sơ',
      data: null
    };
  }
};

export const getApplicationsByStudent = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/ho_so?email=${email}`);
    return {
      success: true,
      message: 'Lấy danh sách hồ sơ thành công',
      data: response.data as HoSoType[]
    };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi khi lấy danh sách hồ sơ',
      data: []
    };
  }
};
