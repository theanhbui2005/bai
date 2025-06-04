import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Upload, message, Table, Modal, Card, Row, Col, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useThiSinhModel from '@/models/thisinh';


const { Option } = Select;

const ThiSinhPage: React.FC = () => {
	type ThiSinh = {
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
	};

	const {
		data,
		getDataThiSinh,
		handleUpload,
		handleSubmit,
		status,
		setStatus,
	} = useThiSinhModel() as {
		data: ThiSinh[];
		getDataThiSinh: () => void;
		handleUpload: (file: File) => void;
		handleSubmit: (values: any) => void;
		status: string;
		setStatus: (status: string) => void;
	};

	const [form] = Form.useForm();
	const [modalVisible, setModalVisible] = useState(false);
	const [latestSubmission, setLatestSubmission] = useState<ThiSinh | null>(null);

	useEffect(() => {
		getDataThiSinh();
	}, []);

	const onFinish = (values: any) => {
		handleSubmit(values);
		message.success('Gửi hồ sơ thành công!');
		setModalVisible(false);
		form.resetFields();
		setStatus('Đã gửi');
		setLatestSubmission({ ...values, trangThai: 'Đã gửi' });
		getDataThiSinh();
	};

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

	return (
		<div style={{ padding: 24 }}>
			{/* <Card style={{ marginBottom: 16 }}>
				<h3>Trạng thái hồ sơ</h3>
				<Space size="large">
					<div>
						<span style={{ color: '#52c41a' }}>●</span> Đã gửi
					</div>
					<div>
						<span style={{ color: '#1890ff' }}>●</span> Đang xử lý
					</div>
					<div>
						<span style={{ color: '#f5222d' }}>●</span> Từ chối
					</div>
				</Space>
			</Card> */}

			{latestSubmission && (
				<Card style={{ marginBottom: 16 }} title="Hồ sơ vừa nộp">
					<Row gutter={[16, 8]}>
						<Col span={8}>
							<b>Họ tên:</b> {latestSubmission.hoTen}
						</Col>
						<Col span={8}>
							<b>Ngày sinh:</b> {latestSubmission.ngaySinh}
						</Col>
						<Col span={8}>
							<b>CMND:</b> {latestSubmission.cmnd}
						</Col>
						<Col span={8}>
							<b>Điểm Toán:</b> {latestSubmission.diemToan}
						</Col>
						<Col span={8}>
							<b>Điểm Văn:</b> {latestSubmission.diemVan}
						</Col>
						<Col span={8}>
							<b>Điểm Anh:</b> {latestSubmission.diemAnh}
						</Col>
						<Col span={8}>
							<b>Ưu tiên:</b> {latestSubmission.uuTien}
						</Col>
						<Col span={8}>
							<b>Trạng thái:</b> <span style={{ color: '#52c41a' }}>{latestSubmission.trangThai}</span>
						</Col>
					</Row>
				</Card>
			)}

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
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
								<Input type="date" />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true }]}>
								<Select>
									<Option value="Nam">Nam</Option>
									<Option value="Nữ">Nữ</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="cmnd" label="CMND" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="diemToan" label="Điểm Toán" rules={[{ required: true, type: 'number', min: 0, max: 10 }]}>
								<InputNumber style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="diemVan" label="Điểm Văn" rules={[{ required: true, type: 'number', min: 0, max: 10 }]}>
								<InputNumber style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="diemAnh" label="Điểm Anh" rules={[{ required: true, type: 'number', min: 0, max: 10 }]}>
								<InputNumber style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="uuTien" label="Ưu tiên" rules={[{ required: true }]}>
								<Select>
									<Option value="Không">Không</Option>
									<Option value="Khu vực">Khu vực</Option>
									<Option value="Đối tượng">Đối tượng</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="fileMinhChung" label="File minh chứng" valuePropName="fileList" getValueFromEvent={e => e && e.fileList}>
								<Upload {...uploadProps}>
									<Button icon={<UploadOutlined />}>Chọn file (PDF/JPEG/PNG)</Button>
								</Upload>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item>
								<Button type="primary" htmlType="submit" block>
									Gửi hồ sơ
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
			{status && <div style={{ marginTop: 16 }}>Trạng thái hồ sơ: <b>{status}</b></div>}
		</div>
	);
};

export default ThiSinhPage;
