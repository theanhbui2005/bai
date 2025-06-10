import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Descriptions, Tag, Steps, Button, message, Alert, Spin, Form, Input, Select, DatePicker, Modal } from 'antd';
import { useModel, history } from 'umi';
import axios from 'axios';
import moment from 'moment';
import { 
  UserOutlined, 
  FileDoneOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  FileSearchOutlined,
  CloseCircleOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

// Interface cho hồ sơ thí sinh
interface HoSoType {
  id: number;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  email: string;
  sdt: string;
  diem_thi: number;
  doi_tuong_uu_tien: string;
  truong_id: number;
  nganh_id: number;
  file_minh_chung: string;
  trang_thai: string;
  ngay_gui: string;
  ghi_chu?: string;
}

// Interface cho thông tin trường
interface TruongType {
  id: number;
  ma_truong: string;
  ten_truong: string;
  dia_chi: string;
  loai_truong: string;
}

// Interface cho thông tin ngành
interface NganhType {
  id: number;
  truong_id: number;
  ma_nganh: string;
  ten_nganh: string;
  mo_ta: string;
}

const StudentPage: React.FC = () => {
  const { userInfo, isLoggedIn, checkLoginStatus, logout } = useModel('auth');
  const [hoSo, setHoSo] = useState<HoSoType | null>(null);
  const [truong, setTruong] = useState<TruongType | null>(null);
  const [nganh, setNganh] = useState<NganhType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editLoading, setEditLoading] = useState<boolean>(false);

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

  // Đặt giá trị form khi hoSo thay đổi
  useEffect(() => {
    if (hoSo) {
      form.setFieldsValue({
        ho_ten: hoSo.ho_ten,
        ngay_sinh: hoSo.ngay_sinh ? moment(hoSo.ngay_sinh) : null,
        gioi_tinh: hoSo.gioi_tinh,
        so_cccd: hoSo.so_cccd,
        email: hoSo.email,
        sdt: hoSo.sdt,
        doi_tuong_uu_tien: hoSo.doi_tuong_uu_tien || '',
      });
    }
  }, [hoSo, form]);

  // Lấy dữ liệu hồ sơ thí sinh
  const fetchStudentData = async (user = userInfo) => {
    setLoading(true);
    try {
      // Lấy danh sách hồ sơ
      const response = await axios.get('/api/ho-so');
      if (response.data && response.data.data) {
        const hoSoList = response.data.data;
        
        // Tìm hồ sơ của thí sinh hiện tại (dựa vào email hoặc id)
        const studentRecord = hoSoList.find((item: any) => 
          (user && user.email && item.email === user.email) || 
          (user && user.id && item.id === user.id)
        );
        
        if (studentRecord) {
          setHoSo(studentRecord);
          
          // Lấy thông tin trường
          if (studentRecord.truong_id) {
            const truongResponse = await axios.get(`/api/truong/${studentRecord.truong_id}`);
            if (truongResponse.data && truongResponse.data.success) {
              setTruong(truongResponse.data.data);
            }
          }
          
          // Lấy thông tin ngành
          if (studentRecord.nganh_id) {
            const nganhResponse = await axios.get(`/api/nganh/${studentRecord.nganh_id}`);
            if (nganhResponse.data && nganhResponse.data.success) {
              setNganh(nganhResponse.data.data);
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
      case 'moi_dang_ky':
        return <Tag color="default">Mới đăng ký</Tag>;
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

  // Bắt đầu chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    Modal.confirm({
      title: 'Xác nhận hủy chỉnh sửa',
      content: 'Các thay đổi sẽ không được lưu. Bạn có chắc chắn muốn hủy?',
      onOk: () => {
        setIsEditing(false);
        if (hoSo) {
          form.setFieldsValue({
            ho_ten: hoSo.ho_ten,
            ngay_sinh: hoSo.ngay_sinh ? moment(hoSo.ngay_sinh) : null,
            gioi_tinh: hoSo.gioi_tinh,
            so_cccd: hoSo.so_cccd,
            email: hoSo.email,
            sdt: hoSo.sdt,
            doi_tuong_uu_tien: hoSo.doi_tuong_uu_tien || '',
          });
        }
      }
    });
  };

  // Lưu thông tin đã chỉnh sửa
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (!hoSo) {
        message.error('Không có thông tin hồ sơ để cập nhật');
        return;
      }

      setEditLoading(true);

      // Định dạng lại ngày sinh nếu có
      const formattedValues = {
        ...values,
        ngay_sinh: values.ngay_sinh ? values.ngay_sinh.format('YYYY-MM-DD') : hoSo.ngay_sinh,
      };

      // Tạo object cập nhật hồ sơ
      const updatedHoSo = {
        ...hoSo,
        ...formattedValues
      };

      // Gửi yêu cầu cập nhật hồ sơ
      try {
        const response = await axios.put(`/api/ho-so/${hoSo.id}`, updatedHoSo);
        if (response.data && response.data.success) {
          message.success('Cập nhật thông tin thành công');
          setHoSo(updatedHoSo);
          setIsEditing(false);
        } else {
          message.error('Không thể cập nhật thông tin: ' + (response.data?.message || 'Đã có lỗi xảy ra'));
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        message.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi xác thực form:', error);
    } finally {
      setEditLoading(false);
    }
  };

  // Hiển thị thông tin cá nhân dạng đọc
  const renderViewMode = () => {
    return (
      <Descriptions 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Thông tin cá nhân</span>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
          </div>
        } 
        bordered
      >
        <Descriptions.Item label="Họ tên" span={3}>{hoSo?.ho_ten}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{hoSo?.ngay_sinh}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{hoSo?.gioi_tinh}</Descriptions.Item>
        <Descriptions.Item label="Số CCCD">{hoSo?.so_cccd}</Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>{hoSo?.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{hoSo?.sdt}</Descriptions.Item>
        <Descriptions.Item label="Điểm thi">{hoSo?.diem_thi}</Descriptions.Item>
        <Descriptions.Item label="Đối tượng ưu tiên">{hoSo?.doi_tuong_uu_tien || 'Chưa có'}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={3}>
          {hoSo ? renderTrangThai(hoSo.trang_thai) : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày nộp" span={3}>{hoSo?.ngay_gui}</Descriptions.Item>
        {hoSo?.ghi_chu && (
          <Descriptions.Item label="Ghi chú" span={3}>{hoSo.ghi_chu}</Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  // Hiển thị form chỉnh sửa
  const renderEditMode = () => {
    return (
      <Card 
        title="Chỉnh sửa thông tin cá nhân"
        extra={
          <div>
            <Button 
              type="default" 
              style={{ marginRight: 8 }}
              onClick={handleCancelEdit}
              disabled={editLoading}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSave}
              loading={editLoading}
            >
              Lưu
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="ho_ten"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ngay_sinh"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY" 
                  placeholder="Chọn ngày sinh" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gioi_tinh"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="so_cccd"
            label="Số CCCD"
            rules={[
              { required: true, message: 'Vui lòng nhập số CCCD!' },
              { pattern: /^[0-9]{12}$/, message: 'Số CCCD phải đủ 12 chữ số!' }
            ]}
          >
            <Input placeholder="Nhập số CCCD" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="sdt"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải đủ 10 chữ số!' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="doi_tuong_uu_tien"
            label="Đối tượng ưu tiên"
          >
            <Select placeholder="Chọn đối tượng ưu tiên">
              <Option value="">Không có</Option>
              <Option value="KV1">Khu vực 1</Option>
              <Option value="KV2">Khu vực 2</Option>
              <Option value="KV3">Khu vực 3</Option>
              <Option value="KV2-NT">Khu vực 2 Nông thôn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    );
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

              {isEditing ? renderEditMode() : renderViewMode()}

              <Title level={3} style={{ marginTop: 24 }}>Thông tin đăng ký</Title>
              <Descriptions bordered>
                <Descriptions.Item label="Trường đăng ký" span={3}>
                  {truong ? truong.ten_truong : 'Chưa đăng ký'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành học" span={3}>
                  {nganh ? nganh.ten_nganh : 'Chưa đăng ký'}
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
            <Spin size="large" />
            <Title level={3} style={{ marginTop: 20 }}>Đang tải thông tin hồ sơ...</Title>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default StudentPage; 