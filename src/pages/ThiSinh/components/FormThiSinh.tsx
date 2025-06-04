import React from 'react';
import { Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface FormThiSinhProps {
	form: any;
	onFinish: (values: any) => void;
	uploadProps: any;
}

const FormThiSinh: React.FC<FormThiSinhProps> = ({ form, onFinish, uploadProps }) => (
	<Form form={form} layout="vertical" onFinish={onFinish}>
		<Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
			<Input />
		</Form.Item>
		<Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
			<Input type="date" />
		</Form.Item>
		<Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true }]}>
			<Select>
				<Option value="Nam">Nam</Option>
				<Option value="Nữ">Nữ</Option>
			</Select>
		</Form.Item>
		<Form.Item name="cmnd" label="CMND" rules={[{ required: true }]}>
			<Input />
		</Form.Item>
		<Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
			<Input />
		</Form.Item>
		<Form.Item name="diemToan" label="Điểm Toán" rules={[{ required: true, type: 'number', min: 0, max: 10 }]}>
			<InputNumber style={{ width: '100%' }} />
		</Form.Item>
		<Form.Item name="diemVan" label="Điểm Văn" rules={[{ required: true, type: 'number', min: 0, max: 10 }]}>
			<InputNumber style={{ width: '100%' }} />
		</Form.Item>
		<Form.Item name="diemAnh" label="Điểm Anh" rules={[{ required: true, type: 'number', min: 0, max: 10 }]}>
			<InputNumber style={{ width: '100%' }} />
		</Form.Item>
		<Form.Item name="uuTien" label="Ưu tiên" rules={[{ required: true }]}>
			<Select>
				<Option value="Không">Không</Option>
				<Option value="Khu vực">Khu vực</Option>
				<Option value="Đối tượng">Đối tượng</Option>
			</Select>
		</Form.Item>
		<Form.Item name="fileMinhChung" label="File minh chứng" valuePropName="fileList" getValueFromEvent={e => e && e.fileList}>
			<Upload {...uploadProps}>
				<Button icon={<UploadOutlined />}>Chọn file (PDF/JPEG/PNG)</Button>
			</Upload>
		</Form.Item>
		<Form.Item>
			<Button type="primary" htmlType="submit" block>
				Gửi hồ sơ
			</Button>
		</Form.Item>
	</Form>
);

export default FormThiSinh;
