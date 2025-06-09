import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Descriptions, Tag, Steps, Button, message, Alert, Spin } from 'antd';
import { useModel, history } from 'umi';
import { getHoSo, getTruongById, getNganhById } from '@/services/Student';
import {
  UserOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  CloseCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import type { HoSoType, TruongType, NganhType } from '@/types/student';
const { Title, Paragraph } = Typography;
const { Step } = Steps;



const StudentPage: React.FC = () => {
  const { userInfo, isLoggedIn, checkLoginStatus, logout } = useModel('auth');
  const [hoSo, setHoSo] = useState<HoSoType | null>(null);
  const [truong, setTruong] = useState<TruongType | null>(null);
  const [nganh, setNganh] = useState<NganhType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Kiểm tra đăng nhập và tải dữ liệu
  useEffect(() => {
    const { loggedIn, role } = checkLoginStatus();
    if (!loggedIn) {
      history.push('/user/login');
    } else if (role === 'admin') {
      history.push('/admin/dashboard');
    } else {
      // Đảm bảo userInfo đã được tải trước khi fetch dữ liệu
      const userInfoLocal = JSON.parse(localStorage.getItem('userInfo') || '{}');
      fetchStudentData(userInfoLocal);
    }
  }, []);

  // Lấy dữ liệu hồ sơ thí sinh
  const fetchStudentData = async (user = userInfo) => {
    setLoading(true);
    try {
      const response = await getHoSo();
      if (response.success && response.data) {
        const hoSoList = response.data;
        
        // Tìm hồ sơ của thí sinh hiện tại (dựa vào email hoặc id)
        const studentRecord = hoSoList.find((item: any) => 
          (user && user.email && item.email === user.email) || 
          (user && user.id && item.id === user.id)
        );
        
        if (studentRecord) {
          setHoSo(studentRecord);
          
          // Lấy thông tin trường
          if (studentRecord.truong_id) {
            const truongResponse = await getTruongById(studentRecord.truong_id);
            if (truongResponse.success) {
              setTruong(truongResponse.data);
            }
          }
          
          // Lấy thông tin ngành
          if (studentRecord.nganh_id) {
            const nganhResponse = await getNganhById(studentRecord.nganh_id);
            if (nganhResponse.success) {
              setNganh(nganhResponse.data);
            }
          }
        } else if (retryCount < 3) {
          // Thử lại nếu không tìm thấy hồ sơ (đôi khi API chưa sẵn sàng)
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            fetchStudentData(user);
          }, 1000);
        } else {
          message.error('Không tìm thấy hồ sơ của bạn trong hệ thống');
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      if (retryCount < 3) {
        // Thử lại nếu có lỗi
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchStudentData(user);
        }, 1000);
      } else {
        message.error('Không thể tải dữ liệu hồ sơ');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái hồ sơ
  const renderTrangThai = (trangThai: string) => {
    switch (trangThai) {
      case 'cho_duyet':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Chờ duyệt</Tag>;
      case 'da_duyet':
        return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
      case 'tu_choi':
        return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
      default:
        return <Tag color="default">{trangThai}</Tag>;
    }
  };

  // Xác định bước hiện tại trong tiến trình xét tuyển
  const getCurrentStep = (trangThai: string) => {
    switch (trangThai) {
      case 'cho_duyet':
        return 1;
      case 'da_duyet':
        return 2;
      case 'tu_choi':
        return 3;
      default:
        return 0;
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
  };

  return (
    <PageContainer
      title="Thông tin thí sinh"
      subTitle="Xem thông tin hồ sơ và trạng thái xét tuyển của bạn"
      extra={[
        <Button
          key="logout"
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>,
      ]}
    >
      {!loading && hoSo ? (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={2}>Hồ sơ xét tuyển của bạn</Title>
              
              <div style={{ marginBottom: 24 }}>
                <Steps current={getCurrentStep(hoSo.trang_thai)} labelPlacement="vertical">
                  <Step title="Đã nộp" description="Hồ sơ đã được nộp" icon={<FileDoneOutlined />} />
                  <Step title="Đang xét duyệt" description="Hồ sơ đang được xem xét" icon={<FileSearchOutlined />} />
                  <Step title="Kết quả" description={hoSo.trang_thai === 'da_duyet' ? 'Đã duyệt' : 'Từ chối'} icon={hoSo.trang_thai === 'da_duyet' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} />
                </Steps>
              </div>

              <Descriptions title="Thông tin cá nhân" bordered>
                <Descriptions.Item label="Họ tên" span={3}>{hoSo.ho_ten}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{hoSo.ngay_sinh}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{hoSo.gioi_tinh}</Descriptions.Item>
                <Descriptions.Item label="Số CCCD">{hoSo.so_cccd}</Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>{hoSo.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{hoSo.sdt}</Descriptions.Item>
                <Descriptions.Item label="Điểm thi">{hoSo.diem_thi}</Descriptions.Item>
                <Descriptions.Item label="Đối tượng ưu tiên">{hoSo.doi_tuong_uu_tien}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={3}>
                  {renderTrangThai(hoSo.trang_thai)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày nộp" span={3}>{hoSo.ngay_gui}</Descriptions.Item>
                {hoSo.ghi_chu && (
                  <Descriptions.Item label="Ghi chú" span={3}>{hoSo.ghi_chu}</Descriptions.Item>
                )}
              </Descriptions>

              <Title level={3} style={{ marginTop: 24 }}>Thông tin đăng ký</Title>
              <Descriptions bordered>
                <Descriptions.Item label="Trường đăng ký" span={3}>
                  {truong ? truong.ten_truong : 'Đang tải...'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành học" span={3}>
                  {nganh ? nganh.ten_nganh : 'Đang tải...'}
                </Descriptions.Item>
              </Descriptions>

              {hoSo.trang_thai === 'tu_choi' && hoSo.ghi_chu && (
                <Alert
                  message="Lý do từ chối"
                  description={hoSo.ghi_chu}
                  type="error"
                  showIcon
                  style={{ marginTop: 24 }}
                />
              )}
            </Card>
          </Col>
        </Row>
      ) : (
        <Card loading={loading}>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Title level={3}>Đang tải thông tin hồ sơ...</Title>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default StudentPage;