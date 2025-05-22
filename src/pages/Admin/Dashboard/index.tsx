import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Button } from 'antd';
import { BankOutlined, FileOutlined, LogoutOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import styles from './index.less';

const AdminDashboard: React.FC = () => {
  const { adminInfo, isLoggedIn, checkLoginStatus, logout } = useModel('admin');

  // Kiểm tra đăng nhập
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (!loggedIn) {
      history.push('/admin/login');
    }
  }, []);

  // Nếu chưa đăng nhập thì chuyển về trang đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/admin/login');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    history.push('/admin/login');
  };

  const goToSchoolManagement = () => {
    history.push('/admin/schools');
  };

  const goToApplicationManagement = () => {
    history.push('/admin/applications');
  };

  return (
    <PageContainer
      title="Trang quản trị hệ thống"
      subTitle={`Xin chào, ${adminInfo?.ho_ten || 'Quản trị viên'}`}
      extra={[
        <Button
          key="1"
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>,
      ]}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Card 
            className={styles.dashboardCard} 
            title="Quản lý trường"
            extra={<BankOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
          >
            <p>Quản lý thông tin các trường đại học trong hệ thống</p>
            <p>Thêm, sửa, xóa thông tin trường</p>
            <p>Cập nhật thông tin chi tiết về trường và ngành học</p>
            <Button 
              type="primary" 
              size="large" 
              style={{ marginTop: 16 }}
              onClick={goToSchoolManagement}
            >
              Quản lý trường
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            className={styles.dashboardCard} 
            title="Quản lý hồ sơ"
            extra={<FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
          >
            <p>Quản lý hồ sơ xét tuyển của thí sinh</p>
            <p>Duyệt hồ sơ, xem thông tin chi tiết</p>
            <p>Cập nhật trạng thái và ghi chú cho hồ sơ</p>
            <Button 
              type="primary" 
              size="large" 
              style={{ marginTop: 16 }}
              onClick={goToApplicationManagement}
            >
              Quản lý hồ sơ
            </Button>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard; 