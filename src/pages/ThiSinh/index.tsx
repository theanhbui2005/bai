import React, { useEffect, useState } from 'react';
import { Button, Form, message, Table, Card } from 'antd';
import { useModel } from 'umi';
import type { ThiSinh } from '@/models/ThiSinh/types';
import SelectionForm from './Selection/Form';
import FormThiSinh from './FormThiSinh';

const ThiSinhPage: React.FC = () => {
    const { data, getDataThiSinh, handleUpload, handleSubmit, status, setStatus } = useModel('thisinh');
    const [currentStep, setCurrentStep] = useState<'selection' | 'personal' | 'complete'>('selection');
    const [form] = Form.useForm();
    const [admissionData, setAdmissionData] = useState<{
        school: any;
        major: any;
        combinations: any[];
    } | null>(null);

    useEffect(() => {
        getDataThiSinh();
    }, []);

    const onSelectionComplete = (school: any, major: any, combinations: any[]) => {
        setAdmissionData({ school, major, combinations });
        setCurrentStep('personal');
    };

    const onFinish = (values: any) => {
        if (!admissionData) return;

        const submissionData = {
            ...values,
            truong: admissionData.school.ten_truong,
            nganh: admissionData.major.ten_nganh,
            toHop: admissionData.combinations.map(c => c.ma_to_hop).join(', '),
            trangThai: 'Đã gửi'
        };
        
        handleSubmit(submissionData);
        message.success('Đăng ký xét tuyển thành công!');
        form.resetFields();
        setCurrentStep('complete');
    };

    const columns = [
        { title: 'Họ tên', dataIndex: 'hoTen' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh' },
        { title: 'CMND', dataIndex: 'cmnd' },
        { title: 'Điểm Toán', dataIndex: 'diemToan' },
        { title: 'Điểm Văn', dataIndex: 'diemVan' },
        { title: 'Điểm Anh', dataIndex: 'diemAnh' },
        { title: 'Ưu tiên', dataIndex: 'uuTien' },
        { title: 'File minh chứng', dataIndex: 'fileMinhChung', render: (val: string) => val || '-' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'trangThai',
            render: (val: string) => (
                <span style={{ 
                    color: val === 'Đã gửi' ? '#52c41a' : 
                           val === 'Đang xử lý' ? '#1890ff' : '#f5222d'
                }}>
                    {val}
                </span>
            )
        },
    ];

    const renderContent = () => {
        switch (currentStep) {
            case 'selection':
                return <SelectionForm onComplete={onSelectionComplete} />;

            case 'personal':
                return (
                    <>
                        <Card title="Thông tin đăng ký" style={{ marginBottom: 16 }}>
                            <p><strong>Trường:</strong> {admissionData?.school.ten_truong}</p>
                            <p><strong>Ngành:</strong> {admissionData?.major.ten_nganh}</p>
                            <p><strong>Tổ hợp xét tuyển:</strong> {admissionData?.combinations.map(c => c.ma_to_hop).join(', ')}</p>
                            <Button onClick={() => setCurrentStep('selection')}>Chọn lại</Button>
                        </Card>

                        <Card title="Thông tin thí sinh">
                            <FormThiSinh
                                form={form}
                                onFinish={onFinish}
                                uploadProps={{
                                    beforeUpload: handleUpload,
                                    maxCount: 1,
                                }}
                            />
                        </Card>
                    </>
                );

            case 'complete':
                return (
                    <>
                        <Card style={{ marginBottom: 16 }}>
                            <Button type="primary" onClick={() => setCurrentStep('selection')}>
                                Đăng ký xét tuyển mới
                            </Button>
                        </Card>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="cmnd"
                            pagination={false}
                            scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
                        />
                    </>
                );
        }
    };

    return <div style={{ padding: 24 }}>{renderContent()}</div>;
};

export default ThiSinhPage;
