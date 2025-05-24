import { Major }from '@/services/selectionOptions/Major'; 
export type LoaiTruong = 'Công lập' | 'Tư Lập' ;
export interface School {
    id: number;
    ma_truong: string;
    ten_truong: string;
    dia_chi: string;
    loai_truong: LoaiTruong;
    majorList:Major[];
  }

