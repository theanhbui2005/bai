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

export interface SelectOption {
  label: string;
  value: number;
}
