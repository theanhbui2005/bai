import { useState } from 'react';
import type { ThiSinh } from './ThiSinh/types';

export default function useThiSinh() {
    const [data, setData] = useState<ThiSinh[]>([]);
    const [status, setStatus] = useState<string>('');

    const getDataThiSinh = () => {
        const dataLocal = JSON.parse(localStorage.getItem('thisinh') || '[]');
        setData(dataLocal);
    };

    const handleUpload = (file: File) => {
        console.log('File uploaded:', file);
    };

    const handleSubmit = (values: ThiSinh) => {
        const newData = [values, ...data];
        localStorage.setItem('thisinh', JSON.stringify(newData));
        setData(newData);
    };

    return {
        data,
        status,
        setStatus,
        getDataThiSinh,
        handleUpload,
        handleSubmit,
    };
}
