import { request } from 'umi';

export interface StudentType {
  id: number;
  username: string;
  password?: string;
  ho_ten: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  status: 'active' | 'inactive';
}

export interface HoSoType {
  id: number;
  student_id: number;
  truong_id: number;
  nganh_id: number;
  diem_thi: number;
  ngay_gui: string;
  trang_thai: string;
}

// Student Authentication
export async function loginStudent(data: { username: string; password: string }) {
  return request<{
    success: boolean;
    data: StudentType;
    message: string;
  }>('http://localhost:3000/students/login', {
    method: 'POST',
    data,
  });
}

// Get Student Profile
export async function getStudentProfile(id: number) {
  return request<{
    success: boolean;
    data: StudentType;
    message: string;
  }>(`http://localhost:3000/students/${id}`, {
    method: 'GET',
  });
}

// Get Student Applications
export async function getStudentApplications(email: string) {
  return request<{
    success: boolean;
    data: HoSoType[];
    message: string;
  }>(`http://localhost:3000/ho-so`, {
    method: 'GET',
    params: { email },
  });
}

// Submit Application
export async function submitApplication(data: Omit<HoSoType, 'id' | 'ngay_gui' | 'trang_thai'>) {
  return request<{
    success: boolean;
    data: HoSoType;
    message: string;
  }>('http://localhost:3000/ho-so', {
    method: 'POST',
    data: {
      ...data,
      ngay_gui: new Date().toISOString(),
      trang_thai: 'cho_duyet',
    },
  });
}

// Get School Information
export async function getSchoolInfo(id: number) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>(`http://localhost:3000/truong/${id}`, {
    method: 'GET',
  });
}

// Get Major Information
export async function getMajorInfo(id: number) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>(`http://localhost:3000/nganh/${id}`, {
    method: 'GET',
  });
}