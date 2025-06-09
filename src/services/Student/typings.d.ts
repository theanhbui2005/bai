declare module Student {
  export interface HoSo {
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
    trang_thai: string;
    ngay_gui: string;
    ghi_chu?: string;
  }

  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
  }
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
  trang_thai: string;
  ngay_gui: string;
  ghi_chu?: string;
}

// Interface cho thông tin trường
  export interface TruongType {
  id: number;
  ma_truong: string;
  ten_truong: string;
  dia_chi: string;
  loai_truong: string;
  }

// Interface cho thông tin ngành
  export interface NganhType {
  id: number;
  truong_id: number;
  ma_nganh: string;
  ten_nganh: string;
  mo_ta: string;
}
}
