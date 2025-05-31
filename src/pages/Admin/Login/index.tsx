import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import styles from './index.less';

const AdminLogin: React.FC = () => {
  const { login, loading, isLoggedIn, checkLoginStatus } = useModel('admin');
  const [form] = Form.useForm();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (loggedIn) {
      message.success('Bạn đã đăng nhập');
      history.push('/admin/dashboard');
    }
  }, []);

  // Nếu đăng nhập thành công, chuyển đến trang dashboard
  useEffect(() => {
    if (isLoggedIn) {
      history.push('/admin/dashboard');
    }
  }, [isLoggedIn]);

  const onFinish = async (values: { username: string; password: string }) => {
    const success = await login(values.username, values.password);
    if (success) {
      form.resetFields();
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Đăng Nhập Quản Trị Viên" className={styles.loginCard}>
        <Form
          form={form}
          name="admin_login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên đăng nhập" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className={styles.loginButton}
              size="large"
              block
            >
              Đăng Nhập
            </Button>
          </Form.Item>
          
          <div className={styles.hint}>
            <p>Tài khoản mặc định: admin</p>
            <p>Mật khẩu mặc định: admin123</p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin; 