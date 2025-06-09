export interface HoSoType {
  id?: number;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  email: string;
  sdt: string;
  diem_thi: number;
  doi_tuong_uu_tien: string;
  trang_thai: string;
  ngay_gui: string;
  ghi_chu?: string;
  truong_id?: number;
  nganh_id?: number;
}

export interface TruongType {
  id: number;
  ten_truong: string;
}

export interface NganhType {
  id: number;
  ten_nganh: string;
}