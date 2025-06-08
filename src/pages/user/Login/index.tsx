import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, Tabs, Alert } from 'antd';
import { 
	UserOutlined, 
	SafetyOutlined, 
	MailOutlined, 
	BankOutlined, 
	IdcardOutlined
} from '@ant-design/icons';
import { useModel, history } from 'umi';
import styles from './index.less';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const Login: React.FC = () => {
	const { login, loading, isLoggedIn, userRole, checkLoginStatus } = useModel('auth');
	const [form] = Form.useForm();
	const [activeTab, setActiveTab] = useState<string>('1');

	// Kiểm tra trạng thái đăng nhập
	useEffect(() => {
		const { loggedIn, role } = checkLoginStatus();
		if (loggedIn) {
			if (role === 'admin') {
				history.push('/admin/dashboard');
			} else if (role === 'student') {
				history.push('/student/profile');
			} else {
				history.push('/dashboard');
			}
		}
	}, []);

	// Nếu đăng nhập thành công, chuyển đến trang phù hợp
	useEffect(() => {
		if (isLoggedIn) {
			if (userRole === 'admin') {
				history.push('/admin/dashboard');
			} else if (userRole === 'student') {
				history.push('/student/profile');
			} else {
				history.push('/dashboard');
			}
		}
	}, [isLoggedIn, userRole]);

	const onFinish = async (values: { username: string; password: string }) => {
		const result = await login(values.username, values.password);
		if (result.success) {
			form.resetFields();
		}
	};

	const handleTabChange = (key: string) => {
		setActiveTab(key);
		form.resetFields();
	};

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<Title level={2} className={styles.formTitle}>
					Hệ Thống Quản Lý Tuyển Sinh Đại Học
				</Title>
				<Paragraph className={styles.formDesc}>
					Chào mừng bạn đến với cổng thông tin tuyển sinh trực tuyến
				</Paragraph>

				<Tabs 
					defaultActiveKey="1" 
					centered 
					onChange={handleTabChange}
					tabBarStyle={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }}
				>
					<TabPane 
						tab={
							<span>
								<IdcardOutlined />
								Thí Sinh
							</span>
						} 
						key="1"
					/>
					<TabPane 
						tab={
							<span>
								<BankOutlined />
								Quản Trị Viên
							</span>
						} 
						key="2"
					/>
				</Tabs>

				{activeTab === '1' && (
					<Alert
						message="Thông tin đăng nhập thí sinh"
						description={
							<>
								<div>Sử dụng <Text strong>Email</Text> hoặc <Text strong>Số CCCD</Text> để đăng nhập.</div>
								<div>Mật khẩu mặc định là <Text strong>số CCCD</Text> của bạn.</div>
							</>
						}
						type="info"
						showIcon
						style={{ marginBottom: 24 }}
					/>
				)}

				<Form
					form={form}
					name="login"
					onFinish={onFinish}
					size="large"
					layout="vertical"
				>
					<Form.Item
						name="username"
						label={activeTab === '1' ? "Email/CCCD" : "Tên đăng nhập"}
						rules={[{ required: true, message: activeTab === '1' ? 'Vui lòng nhập email hoặc CCCD!' : 'Vui lòng nhập tên đăng nhập!' }]}
					>
						<Input 
							prefix={activeTab === '1' ? <MailOutlined className={styles.prefixIcon} /> : <UserOutlined className={styles.prefixIcon} />} 
							placeholder={activeTab === '1' ? "Nhập email hoặc số CCCD" : "Nhập tên đăng nhập"}
						/>
					</Form.Item>

					<Form.Item
						name="password"
						label="Mật khẩu"
						rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
					>
						<Input.Password
							prefix={<SafetyOutlined className={styles.prefixIcon} />}
							placeholder="Nhập mật khẩu"
						/>
					</Form.Item>

					<Form.Item>
						<Button 
							type="primary" 
							htmlType="submit" 
							loading={loading}
							className={styles.loginButton}
							block
						>
							Đăng Nhập
						</Button>
					</Form.Item>
				</Form>
			</div>

			<div className={styles.footer}>
				<Text type="secondary">© 2024 Hệ Thống Quản Lý Tuyển Sinh. All Rights Reserved.</Text>
			</div>
		</div>
	);
};

export default Login;
