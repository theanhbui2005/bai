import { Form, Input, Button, Card, message } from 'antd';
import { history } from 'umi';

const RegisterPage = () => {
  const onFinish = async (values: any) => {
    try {
      const response = await fetch('http://localhost:3000/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          ho_ten: values.fullName,
          email: values.email,
          role: 'student',
          trang_thai: 'active',
        }),
      });
      if (response.ok) {
        message.success('Đăng ký thành công');
        history.push('/user/login');
      }
    } catch (error) {
      message.error('Đăng ký thất bại');
    }
  };

  return (
    <Card title="Đăng ký" style={{ width: 400, margin: '50px auto' }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
      </Form>
    </Card>
  );
};

export default RegisterPage;
