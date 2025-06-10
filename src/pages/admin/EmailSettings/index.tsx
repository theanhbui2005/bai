import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, message, Alert, Typography, Divider, Space } from 'antd';
import { SendOutlined, SettingOutlined, SaveOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';

import emailjs from '@emailjs/browser';

const { Title, Paragraph, Text, Link } = Typography;

const EmailSettings: React.FC = () => {
  const { isLoggedIn, checkLoginStatus } = useModel('admin');
  const [loading, setLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (!loggedIn) {
      history.push('/admin/login');
    } else {
      // Tải cấu hình từ localStorage
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      loadSettings();
    }
  }, []);

  // Tải cấu hình từ localStorage
  const loadSettings = () => {
    const emailSettings = localStorage.getItem('emailjs_settings');
    if (emailSettings) {
      try {
        const settings = JSON.parse(emailSettings);
        form.setFieldsValue(settings);
      } catch (error) {
        console.error('Lỗi khi đọc cấu hình email:', error);
      }
    }
  };

  // Lưu cấu hình
  const saveSettings = async (values: any) => {
    setLoading(true);
    try {
      // Lưu vào localStorage
      localStorage.setItem('emailjs_settings', JSON.stringify(values));
      
      message.success('Đã lưu cấu hình EmailJS!');
    } catch (error) {
      console.error('Lỗi khi lưu cấu hình:', error);
      message.error('Không thể lưu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  // Gửi email thử nghiệm
  const sendTestEmail = async () => {
    try {
      const values = await form.validateFields();
      setTestLoading(true);
      
      // Lưu cấu hình trước
      localStorage.setItem('emailjs_settings', JSON.stringify(values));
      
      // Khởi tạo với user id mới
      emailjs.init(values.user_id);
      
      // Gửi email thử nghiệm sử dụng template
      const result = await emailjs.send(
        values.service_id,
        values.template_id_approval,
        {
          to_email: values.test_email,
          to_name: "Người nhận thử nghiệm",
          school_name: "Trường test",
          major_name: "Ngành test",
          score: "28.5",
          note: "Đây là email thử nghiệm"
        }
      );
      
      console.log("Gửi email thành công:", result);
      message.success('Đã gửi email thử nghiệm!');
    } catch (error: any) {
      console.error('Lỗi khi gửi email thử nghiệm:', error);
      message.error('Không thể gửi email thử nghiệm. ' + (error.text || JSON.stringify(error)));
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <PageContainer title="Cấu hình gửi email">
      <Card>
        <Title level={4}><SettingOutlined /> Cấu hình EmailJS</Title>
        <Alert
          message="Hướng dẫn cấu hình EmailJS"
          description={
            <div>
              <Paragraph>
                EmailJS là dịch vụ cho phép gửi email trực tiếp từ client-side JavaScript. Để sử dụng, bạn cần:
              </Paragraph>
              <ol>
                <li>Đăng ký tài khoản tại <Link href="https://www.emailjs.com/" target="_blank">EmailJS.com</Link></li>
                <li>Tạo service và kết nối với nhà cung cấp email của bạn (Gmail, Outlook...)</li>
                <li>Tạo các email templates với các biến động</li>
                <li>Nhập các thông tin ID vào form dưới đây</li>
              </ol>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={saveSettings}
        >
          <Form.Item
            name="user_id"
            label="User ID"
            rules={[{ required: true, message: 'Vui lòng nhập User ID!' }]}
            tooltip="ID người dùng EmailJS, tìm trong mục Account > API Keys"
          >
            <Input placeholder="Ví dụ: user_xxxxxxxxxxxxxxxxxxx" />
          </Form.Item>
          
          <Form.Item
            name="service_id"
            label="Service ID"
            rules={[{ required: true, message: 'Vui lòng nhập Service ID!' }]}
            tooltip="ID của service trong EmailJS"
          >
            <Input placeholder="Ví dụ: default_service" />
          </Form.Item>
          
          <Form.Item
            name="template_id_approval"
            label="Template ID - Chấp nhận hồ sơ"
            rules={[{ required: true, message: 'Vui lòng nhập Template ID!' }]}
            tooltip="ID của template email chấp nhận hồ sơ trong EmailJS"
          >
            <Input placeholder="Ví dụ: template_approval" />
          </Form.Item>
          
          <Form.Item
            name="template_id_rejection"
            label="Template ID - Từ chối hồ sơ"
            rules={[{ required: true, message: 'Vui lòng nhập Template ID!' }]}
            tooltip="ID của template email từ chối hồ sơ trong EmailJS"
          >
            <Input placeholder="Ví dụ: template_rejection" />
          </Form.Item>
          
          <Divider />
          
          <Form.Item
            name="test_email"
            label="Email thử nghiệm"
            tooltip="Nhập email để gửi thử"
          >
            <Input placeholder="Nhập email của bạn để gửi thử" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Lưu cấu hình
              </Button>
              
              <Button
                type="default"
                icon={<SendOutlined />}
                onClick={sendTestEmail}
                loading={testLoading}
              >
                Gửi email thử
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default EmailSettings; 