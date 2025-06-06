import { useState } from 'react';
import { getData } from '@/services/RandomUser';
import type { Record, UseRandomUserModel } from './types';

export const useRandomUser = (): UseRandomUserModel => {
  const [data, setData] = useState<Record[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Record>();

  const getDataUser = async () => {
    const dataLocal = JSON.parse(localStorage.getItem('data') || '[]');
    if (!dataLocal?.length) {
      const res = await getData();
      localStorage.setItem('data', JSON.stringify(res?.data ?? []));
      setData(res?.data ?? []);
      return;
    }
    setData(dataLocal);
  };

  return {
    data,
    visible,
    setVisible,
    row,
    setRow,
    isEdit,
    setIsEdit,
    setData,
    getDataUser,
  };
};
