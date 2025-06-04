import { getThiSinhData, submitHoSo } from '@/services/ThiSinh';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<ThiSinh.Record>();
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [status, setStatus] = useState<string>('');

	const getDataThiSinh = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('thisinh_data') as any);
		if (!dataLocal?.length) {
			const res = await getThiSinhData();
			localStorage.setItem('thisinh_data', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	const handleUpload = (file: File) => {
		setUploadFile(file);
	};

	const handleSubmit = async (formData: any) => {
		const res = await submitHoSo({ ...formData, file: uploadFile });
		if (res?.success) {
			setStatus('Đã gửi');
			getDataThiSinh();
		}
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
		getDataThiSinh,
		uploadFile,
		setUploadFile,
		handleUpload,
		handleSubmit,
		status,
		setStatus,
	};
};
