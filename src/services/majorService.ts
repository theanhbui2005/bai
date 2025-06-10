interface Major {
  id?: string;
  truong_id: number;
  ma_nganh: string;
  ten_nganh: string;
  mo_ta: string;
}

interface SubjectGroup {
  id?: string;
  nganh_id: string;
  ma_to_hop: string;
  cac_mon: string;
}

export const majorService = {
  getMajors: async () => {
    const response = await fetch('http://localhost:3000/nganh');
    return response.json();
  },

  getSchools: async () => {
    const response = await fetch('http://localhost:3000/truong');
    return response.json();
  },

  addMajor: async (major: Major) => {
    const response = await fetch('http://localhost:3000/nganh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...major, id: Date.now().toString() }),
    });
    return response.json();
  },

  updateMajor: async (id: string, major: Major) => {
    const response = await fetch(`http://localhost:3000/nganh/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(major),
    });
    return response.json();
  },

  deleteMajor: async (id: string) => {
    await fetch(`http://localhost:3000/nganh/${id}`, {
      method: 'DELETE',
    });
  },

  getSubjectGroups: async (majorId: string) => {
    const response = await fetch(`http://localhost:3000/to_hop_xet_tuyen?nganh_id=${majorId}`);
    return response.json();
  },

  addSubjectGroup: async (subjectGroup: SubjectGroup) => {
    const response = await fetch('http://localhost:3000/to_hop_xet_tuyen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...subjectGroup, id: Date.now().toString() }),
    });
    return response.json();
  },

  deleteSubjectGroup: async (id: string) => {
    await fetch(`http://localhost:3000/to_hop_xet_tuyen/${id}`, {
      method: 'DELETE',
    });
  }
};
