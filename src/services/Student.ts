import { request } from 'umi';
import type { HoSoType } from '@/types/student';

export async function getHoSo() {
  return request<{
    success: boolean;
    data: HoSoType[];
    message: string;
  }>('http://localhost:3000/ho_so', {
    method: 'GET',
  });
}

export async function getHoSoById(id: number) {
  return request<{
    success: boolean;
    data: HoSoType;
    message: string;
  }>(`http://localhost:3000/ho_so/id`, {
    method: 'GET',
  });
}

export async function getTruongById(id: number) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>(`http://localhost:3000/truong/id`, {
    method: 'GET',
  });
}

export async function getNganhById(id: number) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>(`http://localhost:3000/nganh/id`, {
    method: 'GET',
  });
}
