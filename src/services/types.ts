export interface School {
  id: number;
  ma_truong: string;
  ten_truong: string;
  dia_chi: string;
  loai_truong: string;
}

export interface Major {
  id: number;
  truong_id: number;
  ma_nganh: string;
  ten_nganh: string;
  mo_ta: string;
}

export interface SubjectGroup {
  id: number;
  nganh_id: number;
  ma_to_hop: string;
  cac_mon: string;
}

export interface Application {
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
  ghi_chu?: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
  ho_ten: string;
  email: string;
  role: string;
  trang_thai: string;
}
