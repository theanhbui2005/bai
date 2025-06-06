export interface ThiSinh {
    hoTen: string;
    ngaySinh: string;
    gioiTinh?: string;
    cmnd: string;
    diaChi?: string;
    diemToan?: number;
    diemVan?: number;
    diemAnh?: number;
    uuTien?: string;
    fileMinhChung?: string;
    trangThai: string;
    truong?: string;
    nganh?: string;
    toHop?: string;
}

export interface UseThiSinhModel {
    data: ThiSinh[];
    status: string;
    setStatus: (status: string) => void;
    getDataThiSinh: () => void;
    handleUpload: (file: File) => void;
    handleSubmit: (values: ThiSinh) => void;
}
