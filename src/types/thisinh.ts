export interface ThiSinh {
  id: number;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ';  // Using literal types for better type safety
  cmnd: string;
  diaChi: string;
  diemToan: number;
  diemVan: number;
  diemAnh: number;
  uuTien: string;
  fileMinhChung?: string;  // Optional field
  trangThai: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';  // Using literal types for status
}

// Utility type for creating new ThiSinh (without id)
export type ThiSinhCreate = Omit<ThiSinh, 'id'>;

// Utility type for updating ThiSinh (all fields optional)
export type ThiSinhUpdate = Partial<ThiSinh>;

// Constants for status values
export const TRANG_THAI = {
  CHO_DUYET: 'Chờ duyệt',
  DA_DUYET: 'Đã duyệt',
  TU_CHOI: 'Từ chối',
} as const;
