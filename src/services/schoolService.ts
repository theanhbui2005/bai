export interface School {
  id?: number;
  ma_truong: string;
  ten_truong: string;
  dia_chi: string;
  loai_truong: 'Công lập' | 'Dân lập';
}

export const schoolService = {
  getSchools: async () => {
    const response = await fetch('http://localhost:3000/truong');
    if (!response.ok) throw new Error('Không thể tải danh sách trường');
    return response.json();
  },

  addSchool: async (school: Omit<School, 'id'>) => {
    const response = await fetch('http://localhost:3000/truong', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...school,
        id: Date.now().toString(), // Generate unique ID
      }),
    });
    if (!response.ok) throw new Error('Không thể thêm trường');
    return response.json();
  },

  updateSchool: async (id: string, school: Partial<School>) => {
    const response = await fetch(`http://localhost:3000/truong/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school),
    });
    if (!response.ok) throw new Error('Không thể cập nhật trường');
    return response.json();
  },

  deleteSchool: async (id: string) => {
    const response = await fetch(`http://localhost:3000/truong/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Không thể xóa trường');
  },
};
