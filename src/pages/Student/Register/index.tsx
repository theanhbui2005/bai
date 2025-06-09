import React from 'react';
import { Form, Input, Button, Card, DatePicker, Select, message } from 'antd';
import { history } from 'umi';
import { registerStudent } from '@/services/Student/auth';

const { Option } = Select;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const result = await registerStudent({
        ...values,
        ngay_sinh: values.ngay_sinh.format('YYYY-MM-DD')
      });

      if (result.success) {
        message.success(result.message);
        history.push('/student/login');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Đăng ký thất bại');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <Card title="Đăng ký tài khoản">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="ho_ten"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="sdt"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ngay_sinh"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="gioi_tinh"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="so_cccd"
            label="Số CCCD"
            rules={[{ required: true, message: 'Vui lòng nhập số CCCD' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản? <a href="/student/login">Đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
