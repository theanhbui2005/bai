import React, { useEffect, useState } from 'react';
import { Button, Form, message, Table, Modal, Card, Select, Upload } from 'antd';
import { useModel } from 'umi';
import type { ThiSinh } from '@/models/ThiSinh/types';
import SelectionForm from './Selection/Form';
import FormThiSinh from './FormThiSinh';
const { Option } = Select;

const ThiSinhPage: React.FC = () => {
    const { data, getDataThiSinh, handleUpload, handleSubmit, status, setStatus } = useModel('thisinh');
    
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [latestSubmission, setLatestSubmission] = useState<ThiSinh | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<any>(null);
    const [selectedMajor, setSelectedMajor] = useState<any>(null);
    const [selectedCombinations, setSelectedCombinations] = useState<any[]>([]);

    useEffect(() => {
        getDataThiSinh();
    }, []);

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isAllowed = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
            if (!isAllowed) {
                message.error('Chỉ chấp nhận file PDF, JPEG, PNG!');
                return Upload.LIST_IGNORE;
            }
            handleUpload(file);
            return false;
        },
        maxCount: 1,
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

    const getStatusCount = () => {
        const daguiCount = data.filter(item => item.trangThai === 'Đã gửi').length;
        const dangxulyCount = data.filter(item => item.trangThai === 'Đang xử lý').length;
        const tuchoiCount = data.filter(item => item.trangThai === 'Từ chối').length;
        return { daguiCount, dangxulyCount, tuchoiCount };
    };

    const onSelectionComplete = (school: any, major: any, combinations: any[]) => {
        setSelectedSchool(school);
        setSelectedMajor(major);
        setSelectedCombinations(combinations);
        setShowForm(true);
    };

    const onFinish = (values: any) => {
        const submissionData = {
            ...values,
            truong: selectedSchool?.ten_truong,
            nganh: selectedMajor?.ten_nganh,
            toHop: selectedCombinations.map(c => c.ma_to_hop).join(', ')
        };
        
        handleSubmit(submissionData);
        message.success('Gửi hồ sơ thành công!');
        setModalVisible(false);
        form.resetFields();
        setStatus('Đã gửi');
        setLatestSubmission({ ...submissionData, trangThai: 'Đã gửi' });
        getDataThiSinh();
        setShowForm(false);
    };

    return (
        <div style={{ padding: 24 }}>
            {!showForm ? (
                <SelectionForm onComplete={onSelectionComplete} />
            ) : (
                <>
                    <Card style={{ marginBottom: 16 }}>
                        <h3>Thông tin đăng ký</h3>
                        <p><strong>Trường:</strong> {selectedSchool?.ten_truong}</p>
                        <p><strong>Ngành:</strong> {selectedMajor?.ten_nganh}</p>
                        <p><strong>Tổ hợp xét tuyển:</strong> {selectedCombinations.map(c => c.ma_to_hop).join(', ')}</p>
                        <Button onClick={() => setShowForm(false)}>Quay lại chọn ngành</Button>
                    </Card>

                    <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
                        Nhập hồ sơ thí sinh
                    </Button>
                    
                    <Table 
                        columns={columns} 
                        dataSource={data} 
                        rowKey="cmnd" 
                        pagination={false}
                        scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
                    />

                    <Modal
                        title="Nhập thông tin thí sinh"
                        visible={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                        destroyOnClose
                    >
                        <FormThiSinh
                            form={form}
                            onFinish={onFinish}
                            uploadProps={uploadProps}
                        />
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ThiSinhPage;
