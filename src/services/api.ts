import { School, Major, SubjectGroup, Application, Admin } from './types';

const API_BASE_URL = 'http://localhost:3000';

export const fetchSchools = async () => {
  const response = await fetch(`${API_BASE_URL}/truong`);
  return response.json();
};

export const fetchMajorsBySchool = async (schoolId: number) => {
  const response = await fetch(`${API_BASE_URL}/nganh?truong_id=${schoolId}`);
  return response.json();
};

export const fetchSubjectGroupsByMajor = async (majorId: number) => {
  const response = await fetch(`${API_BASE_URL}/to_hop_xet_tuyen?nganh_id=${majorId}`);
  return response.json();
};

export const submitApplication = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/ho_so`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      trang_thai: 'cho_duyet',
      ngay_gui: new Date().toISOString(),
    }),
  });
  return response.json();
};

export const updateApplicationStatus = async (id: number, status: string) => {
  const response = await fetch(`${API_BASE_URL}/ho_so/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trang_thai: status }),
  });
  return response.json();
};

export const deleteApplication = async (id: number) => {
  await fetch(`${API_BASE_URL}/ho_so/${id}`, {
    method: 'DELETE',
  });
};

export const AdminAPI = {
  login: async (username: string, password: string): Promise<Admin | null> => {
    const response = await fetch(`${API_BASE_URL}/admin?username=${username}&password=${password}`);
    const data = await response.json();
    return data[0] || null;
  }
};
