declare namespace API {
    export  interface ThiSinh {
    id?: number;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: 'Nam' | 'Nữ';
    cmnd: string;
    diaChi: string;
    diemToan: number;
    diemVan: number;
    diemAnh: number;
    uuTien: 'Không' | 'Khu vực' | 'Đối tượng';
    fileMinhChung?: string;
    trangThai?: 'Đã gửi' | 'Đang xử lý' | 'Từ chối';
  }

  interface ThiSinhResponse {
    data: ThiSinh[];
    success: boolean;
  }
}
