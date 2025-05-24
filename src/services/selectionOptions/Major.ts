import { Combination } from '@/services/selectionOptions/Combination'; 
export interface Major {
    id: number;
    truong_id: number;
    ma_nganh: string;
    ten_nganh: string;
    mo_ta: string;

    combinationList:Combination[];
  }
  