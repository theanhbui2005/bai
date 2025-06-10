import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Descriptions, Tag, Steps, Button, message, Alert, Spin, Form, Input, Select, DatePicker, Modal, InputNumber, Upload, Space, Tooltip, Popconfirm } from 'antd';
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
  SaveOutlined,
  PlusOutlined,
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  FileOutlined
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
  to_hop_id: number;
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

// Interface cho tổ hợp xét tuyển
interface ToHopType {
  id: number;
  nganh_id: number;
  ma_to_hop: string;
  cac_mon: string;
}

// Sửa lỗi TypeScript với Select.Option
type OptionProps = {
  children: React.ReactNode;
  value: number | string;
  key: number | string;
};

const StudentPage: React.FC = () => {
  const { userInfo, isLoggedIn, checkLoginStatus, logout } = useModel('auth');
  const [hoSo, setHoSo] = useState<HoSoType | null>(null);
  const [truong, setTruong] = useState<TruongType | null>(null);
  const [nganh, setNganh] = useState<NganhType | null>(null);
  const [toHop, setToHop] = useState<ToHopType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [toHopOptions, setToHopOptions] = useState<ToHopType[]>([]);
  
  // Các biến mới cho đăng ký thông tin
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
  const [registerForm] = Form.useForm();
  const [truongList, setTruongList] = useState<TruongType[]>([]);
  const [nganhList, setNganhList] = useState<NganhType[]>([]);
  const [registerToHopOptions, setRegisterToHopOptions] = useState<ToHopType[]>([]);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  // Thêm state mới cho file minh chứng
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

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
        diem_thi: hoSo.diem_thi || 0
      });
    }
  }, [hoSo, form]);

  // Lấy danh sách tổ hợp xét tuyển khi ngành thay đổi
  useEffect(() => {
    if (hoSo && hoSo.nganh_id) {
      fetchToHopOptions(hoSo.nganh_id);
    }
  }, [hoSo?.nganh_id]);

  // Thêm useEffect để lấy danh sách trường
  useEffect(() => {
    fetchTruongList();
  }, []);

  // Cập nhật mảng fileList khi hoSo thay đổi
  useEffect(() => {
    if (hoSo && hoSo.file_minh_chung) {
      const files = hoSo.file_minh_chung.split(',')
        .filter(file => file.trim() !== '')
        .map(filePath => {
          // Trích xuất tên file từ đường dẫn
          const fileName = filePath.split('/').pop() || '';
          return {
            uid: fileName,
            name: fileName,
            status: 'done',
            url: filePath,
            thumbUrl: getFileIconByType(fileName)
          };
        });
      setFileList(files);
    } else {
      setFileList([]);
    }
  }, [hoSo?.file_minh_chung]);

  // Hàm lấy danh sách trường
  const fetchTruongList = async () => {
    try {
      const response = await axios.get('/api/truong');
      if (response.data && response.data.success) {
        setTruongList(response.data.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách trường:', error);
    }
  };
  
  // Hàm lấy danh sách ngành theo trường
  const fetchNganhList = async (truongId: number) => {
    try {
      const response = await axios.get(`/api/nganh/truong/${truongId}`);
      if (response.data && response.data.success) {
        setNganhList(response.data.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ngành:', error);
    }
  };
  
  // Hàm lấy tổ hợp xét tuyển theo ngành
  const fetchRegisterToHopOptions = async (nganhId: number) => {
    try {
      const response = await axios.get(`/api/to-hop/nganh/${nganhId}`);
      if (response.data && response.data.success) {
        setRegisterToHopOptions(response.data.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tổ hợp xét tuyển:', error);
    }
  };
  
  // Xử lý khi chọn trường
  const handleTruongChange = (truongId: number) => {
    registerForm.setFieldsValue({
      nganh_id: undefined,
      to_hop_id: undefined
    });
    setNganhList([]);
    setRegisterToHopOptions([]);
    fetchNganhList(truongId);
  };
  
  // Xử lý khi chọn ngành
  const handleNganhChange = (nganhId: number) => {
    registerForm.setFieldsValue({
      to_hop_id: undefined
    });
    setRegisterToHopOptions([]);
    fetchRegisterToHopOptions(nganhId);
  };
  
  // Mở modal đăng ký
  const showRegisterModal = () => {
    setIsRegisterModalVisible(true);
  };
  
  // Đóng modal đăng ký
  const handleRegisterCancel = () => {
    setIsRegisterModalVisible(false);
    registerForm.resetFields();
  };
  
  // Xử lý đăng ký thông tin
  const handleRegister = async () => {
    try {
      const values = await registerForm.validateFields();
      if (!hoSo) {
        message.error('Không có thông tin hồ sơ để cập nhật');
        return;
      }
      
      setRegisterLoading(true);
      
      try {
        // Gửi yêu cầu cập nhật thông tin đăng ký
        const updatedHoSo = {
          ...hoSo,
          truong_id: values.truong_id,
          nganh_id: values.nganh_id,
          to_hop_id: values.to_hop_id,
          trang_thai: 'cho_duyet'
        };
        
        const response = await axios.put(`/api/ho-so/${hoSo.id}`, updatedHoSo);
        if (response.data && response.data.success) {
          message.success('Đăng ký thông tin thành công');
          setHoSo(updatedHoSo);
          setIsRegisterModalVisible(false);
          
          // Cập nhật lại thông tin trường, ngành, tổ hợp
          fetchStudentData();
        } else {
          message.error('Không thể đăng ký thông tin: ' + (response.data?.message || 'Đã có lỗi xảy ra'));
        }
      } catch (error) {
        console.error('Lỗi khi đăng ký thông tin:', error);
        message.error('Không thể đăng ký thông tin. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi xác thực form:', error);
    } finally {
      setRegisterLoading(false);
    }
  };

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
          
          // Lấy thông tin tổ hợp xét tuyển
          if (studentRecord.to_hop_id) {
            const toHopResponse = await axios.get(`/api/to-hop/${studentRecord.to_hop_id}`);
            if (toHopResponse.data && toHopResponse.data.success) {
              setToHop(toHopResponse.data.data);
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

  // Lấy danh sách tổ hợp xét tuyển cho ngành
  const fetchToHopOptions = async (nganhId: number) => {
    try {
      const response = await axios.get(`/api/to-hop/nganh/${nganhId}`);
      if (response.data && response.data.success) {
        setToHopOptions(response.data.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách tổ hợp xét tuyển:", error);
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
            diem_thi: hoSo.diem_thi || 0
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
          
          // Nếu tổ hợp xét tuyển thay đổi, cập nhật thông tin tổ hợp
          if (values.to_hop_id && values.to_hop_id !== hoSo.to_hop_id) {
            try {
              const toHopResponse = await axios.get(`/api/to-hop/${values.to_hop_id}`);
              if (toHopResponse.data && toHopResponse.data.success) {
                setToHop(toHopResponse.data.data);
              }
            } catch (e) {
              console.error("Lỗi khi tải thông tin tổ hợp mới:", e);
            }
          }
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

  // Trả về biểu tượng tương ứng với loại file
  const getFileIconByType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    // Logic hiển thị biểu tượng phù hợp (đơn giản hóa cho môi trường mock)
    return ''; // Trong thực tế, sẽ trả về đường dẫn đến icon
  };
  
  // Xử lý upload file
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;
    
    // Tạo đối tượng FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    
    try {
      setUploading(true);
      
      // Gọi API upload file
      const response = await axios.post('/api/upload-minh-chung', {
        fileName: file.name
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        onUploadProgress: (progressEvent: any) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent });
        }
      });
      
      if (response.data && response.data.success) {
        // Nếu upload thành công
        onSuccess(response.data, file);
        
        // Cập nhật trường file_minh_chung trong hồ sơ
        if (hoSo) {
          const newFilePath = response.data.data.filePath;
          let newFileMinhChung = hoSo.file_minh_chung || '';
          
          // Thêm file mới vào danh sách
          if (newFileMinhChung.trim() === '') {
            newFileMinhChung = newFilePath;
          } else {
            newFileMinhChung += ',' + newFilePath;
          }
          
          // Cập nhật hồ sơ với đường dẫn file mới
          const updatedHoSo = {
            ...hoSo,
            file_minh_chung: newFileMinhChung
          };
          
          try {
            const updateResponse = await axios.put(`/api/ho-so/${hoSo.id}`, updatedHoSo);
            if (updateResponse.data && updateResponse.data.success) {
              // Cập nhật state
              setHoSo(updatedHoSo);
              message.success('Upload và cập nhật minh chứng thành công');
            } else {
              message.error('Không thể cập nhật thông tin hồ sơ');
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            message.error('Không thể cập nhật thông tin hồ sơ');
          }
        }
      } else {
        onError({ error: response.data.message || 'Upload thất bại' });
      }
    } catch (error) {
      console.error('Lỗi khi upload file:', error);
      onError({ error: 'Không thể upload file' });
    } finally {
      setUploading(false);
    }
  };
  
  // Xử lý xóa file minh chứng
  const handleRemoveFile = async (file: any) => {
    try {
      // Xác định tên file
      const fileName = file.name || file.url.split('/').pop();
      
      // Gọi API xóa file
      const response = await axios.delete(`/api/minh-chung/${fileName}`);
      
      if (response.data && response.data.success) {
        if (hoSo) {
          // Cập nhật danh sách file trong hồ sơ
          const filesToKeep = hoSo.file_minh_chung
            .split(',')
            .filter(path => !path.includes(fileName))
            .join(',');
            
          // Cập nhật hồ sơ
          const updatedHoSo = {
            ...hoSo,
            file_minh_chung: filesToKeep
          };
          
          try {
            const updateResponse = await axios.put(`/api/ho-so/${hoSo.id}`, updatedHoSo);
            if (updateResponse.data && updateResponse.data.success) {
              setHoSo(updatedHoSo);
              message.success('Xóa minh chứng thành công');
            } else {
              message.error('Không thể cập nhật thông tin hồ sơ');
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            message.error('Không thể cập nhật thông tin hồ sơ');
          }
        }
      } else {
        message.error('Không thể xóa file');
        return false; // Ngăn xóa file khỏi danh sách
      }
    } catch (error) {
      console.error('Lỗi khi xóa file:', error);
      message.error('Không thể xóa file');
      return false; // Ngăn xóa file khỏi danh sách
    }
    
    return true; // Cho phép xóa file khỏi danh sách
  };
  
  // Hiển thị danh sách file minh chứng
  const renderMinhChungList = () => {
    if (!hoSo || !hoSo.file_minh_chung || hoSo.file_minh_chung.trim() === '') {
      return <Tag color="warning">Chưa có minh chứng</Tag>;
    }
    
    return (
      <Space direction="vertical">
        {hoSo.file_minh_chung.split(',').filter(file => file.trim() !== '').map((filePath, index) => {
          const fileName = filePath.split('/').pop() || '';
          return (
            <Space key={index}>
              <FileOutlined />
              <a href={filePath} target="_blank" rel="noopener noreferrer">
                {fileName}
              </a>
            </Space>
          );
        })}
      </Space>
    );
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
        <Descriptions.Item label="Minh chứng" span={3}>
          {renderMinhChungList()}
        </Descriptions.Item>
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="diem_thi"
                label="Điểm thi"
                tooltip="Nhập điểm thi của bạn (thang điểm 30)"
                rules={[{ required: true, message: 'Vui lòng nhập điểm thi!' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Nhập điểm thi" 
                  min={0} 
                  max={30} 
                  step={0.1} 
                  precision={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
          
          <Form.Item 
            label="Tải lên minh chứng" 
            tooltip="Tải lên các file minh chứng như học bạ, CCCD, bằng tốt nghiệp..."
          >
            <Upload
              fileList={fileList}
              customRequest={handleUpload}
              onRemove={handleRemoveFile}
              multiple
              listType="text"
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Tải lên minh chứng
              </Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#888' }}>
              Hỗ trợ tải lên các file PDF, JPG, PNG (tối đa 5MB)
            </div>
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

              <Title level={3} style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Thông tin đăng ký</span>
                  {(!truong || !nganh) && hoSo.trang_thai !== 'da_duyet' && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={showRegisterModal}
                    >
                      Đăng ký
                    </Button>
                  )}
                </div>
              </Title>
              <Descriptions bordered>
                <Descriptions.Item label="Trường đăng ký" span={3}>
                  {truong ? truong.ten_truong : 'Chưa đăng ký'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành học" span={3}>
                  {nganh ? nganh.ten_nganh : 'Chưa đăng ký'}
                </Descriptions.Item>
                <Descriptions.Item label="Tổ hợp xét tuyển" span={3}>
                  {toHop ? `${toHop.ma_to_hop} - ${toHop.cac_mon}` : 'Chưa đăng ký'}
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
      
      {/* Modal đăng ký thông tin */}
      <Modal
        title="Đăng ký thông tin xét tuyển"
        visible={isRegisterModalVisible}
        onCancel={handleRegisterCancel}
        footer={[
          <Button key="back" onClick={handleRegisterCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={registerLoading} onClick={handleRegister}>
            Đăng ký
          </Button>
        ]}
        width={700}
      >
        <Form
          form={registerForm}
          layout="vertical"
        >
          <Form.Item
            name="truong_id"
            label="Chọn trường đại học"
            rules={[{ required: true, message: 'Vui lòng chọn trường đại học!' }]}
          >
            <Select
              placeholder="Chọn trường đại học"
              onChange={handleTruongChange}
              showSearch
              filterOption={(input, option: any) => 
                option.children && option.children.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {truongList.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.ten_truong} ({t.ma_truong})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nganh_id"
            label="Chọn ngành học"
            rules={[{ required: true, message: 'Vui lòng chọn ngành học!' }]}
          >
            <Select
              placeholder="Chọn ngành học"
              onChange={handleNganhChange}
              disabled={nganhList.length === 0}
              showSearch
              filterOption={(input, option: any) => 
                option.children && option.children.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {nganhList.map((n) => (
                <Option key={n.id} value={n.id}>
                  {n.ten_nganh} ({n.ma_nganh})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="to_hop_id"
            label="Chọn tổ hợp xét tuyển"
            rules={[{ required: true, message: 'Vui lòng chọn tổ hợp xét tuyển!' }]}
          >
            <Select
              placeholder="Chọn tổ hợp xét tuyển"
              disabled={registerToHopOptions.length === 0}
            >
              {registerToHopOptions.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.ma_to_hop} - {t.cac_mon}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default StudentPage; 