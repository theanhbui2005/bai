import React, { useState, useEffect } from 'react';
import { useParams, history, useModel } from 'umi';
import { Card, Typography, Spin, Row, Col, Tag, Divider, Button, message, Modal, Form, Input, Select, Popconfirm, Space, Table } from 'antd';
import { BankOutlined, ReadOutlined, BookOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { getSchoolById, updateSchool } from '@/services/School';
import { getNganhByTruongId, getToHopByNganhId, NganhType, ToHopType, addNganh, updateNganh, deleteNganh, getNganhById, getToHopOptions, updateToHopForNganh, deleteToHop } from '@/services/Nganh';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Interface cho dữ liệu tổng hợp: ngành và tổ hợp xét tuyển của ngành đó
interface NganhVaToHopType extends NganhType {
  to_hop_xet_tuyen: ToHopType[];
}

// Interface cho tổ hợp options
interface ToHopOptionType {
  ma_to_hop: string;
  cac_mon: string;
}

const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, checkLoginStatus } = useModel('admin');
  const [loading, setLoading] = useState<boolean>(true);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [nganhData, setNganhData] = useState<NganhVaToHopType[]>([]);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [addNganhModalVisible, setAddNganhModalVisible] = useState<boolean>(false);
  const [editNganhModalVisible, setEditNganhModalVisible] = useState<boolean>(false);
  const [selectedNganh, setSelectedNganh] = useState<NganhType | null>(null);
  const [toHopOptions, setToHopOptions] = useState<ToHopOptionType[]>([]);
  const [selectedToHops, setSelectedToHops] = useState<ToHopOptionType[]>([]);
  const [toHopModalVisible, setToHopModalVisible] = useState<boolean>(false);
  
  // Form
  const [form] = Form.useForm();
  const [nganhForm] = Form.useForm();
  const [editNganhForm] = Form.useForm();
  const [toHopForm] = Form.useForm();

  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (!loggedIn) {
      history.push('/admin/login');
      return;
    }

    fetchSchoolData();
    fetchToHopOptions();
  }, [id]);

  // Lấy danh sách tổ hợp xét tuyển định sẵn
  const fetchToHopOptions = async () => {
    try {
      const response = await getToHopOptions();
      if (response.success) {
        setToHopOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching to hop options:', error);
    }
  };

  // Lấy thông tin trường
  const fetchSchoolData = async () => {
    setLoading(true);
    try {
      const schoolResponse = await getSchoolById(Number(id));
      if (schoolResponse.success && schoolResponse.data) {
        setSchoolData(schoolResponse.data);
        
        // Lấy danh sách ngành của trường
        const nganhResponse = await getNganhByTruongId(Number(id));
        if (nganhResponse.success && nganhResponse.data) {
          // Kết hợp lấy tổ hợp xét tuyển cho từng ngành
          const nganhWithToHop = await Promise.all(
            nganhResponse.data.map(async (nganh) => {
              const toHopResponse = await getToHopByNganhId(nganh.id);
              return {
                ...nganh,
                to_hop_xet_tuyen: toHopResponse.success ? toHopResponse.data : [],
              };
            })
          );
          setNganhData(nganhWithToHop);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal sửa thông tin trường
  const openEditModal = () => {
    form.setFieldsValue(schoolData);
    setEditModalVisible(true);
  };

  // Cập nhật thông tin trường
  const handleUpdateSchool = async () => {
    try {
      const values = await form.validateFields();
      const result = await updateSchool(Number(id), values);
      
      if (result.success) {
        message.success(result.message);
        setEditModalVisible(false);
        fetchSchoolData(); // Tải lại dữ liệu
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  // Mở modal thêm ngành mới
  const openAddNganhModal = () => {
    nganhForm.resetFields();
    nganhForm.setFieldsValue({ truong_id: Number(id) });
    setAddNganhModalVisible(true);
  };

  // Thêm ngành mới
  const handleAddNganh = async () => {
    try {
      const values = await nganhForm.validateFields();
      const result = await addNganh(values);
      
      if (result.success) {
        message.success(result.message);
        setAddNganhModalVisible(false);
        fetchSchoolData(); // Tải lại dữ liệu
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  // Mở modal sửa ngành
  const openEditNganhModal = (nganh: NganhType) => {
    setSelectedNganh(nganh);
    editNganhForm.setFieldsValue(nganh);
    setEditNganhModalVisible(true);
  };

  // Cập nhật thông tin ngành
  const handleUpdateNganh = async () => {
    if (!selectedNganh) return;
    
    try {
      const values = await editNganhForm.validateFields();
      const result = await updateNganh(selectedNganh.id, values);
      
      if (result.success) {
        message.success(result.message);
        setEditNganhModalVisible(false);
        fetchSchoolData(); // Tải lại dữ liệu
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  // Xóa ngành
  const handleDeleteNganh = async (nganhId: number) => {
    try {
      const result = await deleteNganh(nganhId);
      
      if (result.success) {
        message.success(result.message);
        fetchSchoolData(); // Tải lại dữ liệu
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể xóa ngành');
    }
  };

  // Mở modal quản lý tổ hợp xét tuyển
  const openToHopModal = (nganh: NganhVaToHopType) => {
    setSelectedNganh(nganh);
    
    // Chuẩn bị dữ liệu tổ hợp hiện tại
    const currentToHops = nganh.to_hop_xet_tuyen.map(th => ({
      ma_to_hop: th.ma_to_hop,
      cac_mon: th.cac_mon
    }));
    
    setSelectedToHops(currentToHops);
    setToHopModalVisible(true);
  };

  // Cập nhật tổ hợp xét tuyển
  const handleUpdateToHop = async () => {
    if (!selectedNganh) return;
    
    try {
      const result = await updateToHopForNganh(selectedNganh.id, selectedToHops);
      
      if (result.success) {
        message.success(result.message);
        setToHopModalVisible(false);
        fetchSchoolData(); // Tải lại dữ liệu
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể cập nhật tổ hợp xét tuyển');
    }
  };

  // Xử lý khi chọn tổ hợp
  const handleToHopChange = (value: string[]) => {
    // Tìm tổ hợp tương ứng từ danh sách options
    const selected = toHopOptions.filter(opt => value.includes(opt.ma_to_hop));
    setSelectedToHops(selected);
  };

  // Render tag màu dựa trên loại trường
  const renderLoaiTruongTag = (loaiTruong: string) => {
    let color = 'blue';
    if (loaiTruong === 'Công lập') {
      color = 'blue';
    } else if (loaiTruong === 'Dân lập') {
      color = 'green';
    } else if (loaiTruong === 'Quốc tế') {
      color = 'purple';
    }
    return <Tag color={color}>{loaiTruong}</Tag>;
  };

  // Render tag màu cho mã tổ hợp xét tuyển
  const renderToHopTag = (maToHop: string) => {
    const colors: Record<string, string> = {
      'A00': 'magenta',
      'A01': 'red',
      'B00': 'volcano',
      'C00': 'orange',
      'D01': 'gold',
      'D07': 'lime',
      'D14': 'green',
    };
    
    return <Tag color={colors[maToHop] || 'blue'}>{maToHop}</Tag>;
  };

  if (loading) {
    return (
      <PageContainer title="Thông tin trường">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </PageContainer>
    );
  }

  if (!schoolData) {
    return (
      <PageContainer title="Thông tin trường">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>Không tìm thấy thông tin trường</Title>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title={schoolData.ten_truong}
      subTitle="Chi tiết thông tin trường và các ngành đào tạo"
      onBack={() => history.push('/admin/schools')}
      extra={[
        <Button 
          key="edit" 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={openEditModal}
        >
          Sửa thông tin trường
        </Button>
      ]}
    >
      <Card>
        <Title level={2}>
          <BankOutlined /> {schoolData.ten_truong}
        </Title>
        <Paragraph>
          <Text strong>Mã trường: </Text> {schoolData.ma_truong}
        </Paragraph>
        <Paragraph>
          <Text strong>Địa chỉ: </Text> {schoolData.dia_chi}
        </Paragraph>
        <Paragraph>
          <Text strong>Loại trường: </Text> {renderLoaiTruongTag(schoolData.loai_truong)}
        </Paragraph>
      </Card>

      <Divider orientation="left">
        <Title level={3}>
          <ReadOutlined /> Danh sách ngành đào tạo
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ marginLeft: 16 }}
            onClick={openAddNganhModal}
          >
            Thêm ngành mới
          </Button>
        </Title>
      </Divider>

      <Row gutter={[16, 16]}>
        {nganhData.length > 0 ? (
          nganhData.map((nganh) => (
            <Col xs={24} key={nganh.id}>
              <Card
                title={
                  <span>
                    <BookOutlined /> {nganh.ten_nganh}
                  </span>
                }
                bordered={true}
                extra={
                  <Space>
                    <Button
                      type="default"
                      icon={<EditOutlined />}
                      onClick={() => openEditNganhModal(nganh)}
                    >
                      Sửa
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => openToHopModal(nganh)}
                    >
                      Quản lý tổ hợp
                    </Button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa ngành này?"
                      onConfirm={() => handleDeleteNganh(nganh.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <Row>
                  <Col span={24}>
                    <Paragraph>
                      <Text strong>Mã ngành: </Text> {nganh.ma_nganh}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Mô tả: </Text> {nganh.mo_ta}
                    </Paragraph>
                    
                    <Divider orientation="left">Tổ hợp xét tuyển</Divider>
                    
                    <div style={{ marginBottom: 16 }}>
                      {nganh.to_hop_xet_tuyen.length > 0 ? (
                        nganh.to_hop_xet_tuyen.map((toHop) => (
                          <div key={toHop.id} style={{ marginBottom: 8 }}>
                            {renderToHopTag(toHop.ma_to_hop)} - <Text>{toHop.cac_mon}</Text>
                          </div>
                        ))
                      ) : (
                        <Text type="secondary">Chưa có tổ hợp xét tuyển nào. Hãy thêm tổ hợp.</Text>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text>Chưa có ngành nào. Hãy thêm ngành mới.</Text>
            </div>
          </Col>
        )}
      </Row>

      {/* Modal sửa thông tin trường */}
      <Modal
        title="Sửa thông tin trường"
        visible={editModalVisible}
        onOk={handleUpdateSchool}
        onCancel={() => setEditModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="ma_truong"
            label="Mã trường"
            rules={[{ required: true, message: 'Vui lòng nhập mã trường' }]}
          >
            <Input placeholder="Nhập mã trường (ví dụ: DHBK)" />
          </Form.Item>
          <Form.Item
            name="ten_truong"
            label="Tên trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input placeholder="Nhập tên trường đầy đủ" />
          </Form.Item>
          <Form.Item
            name="dia_chi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ trường' }]}
          >
            <Input placeholder="Nhập địa chỉ trường" />
          </Form.Item>
          <Form.Item
            name="loai_truong"
            label="Loại trường"
            rules={[{ required: true, message: 'Vui lòng chọn loại trường' }]}
          >
            <Select placeholder="Chọn loại trường">
              <Option value="Công lập">Công lập</Option>
              <Option value="Dân lập">Dân lập</Option>
              <Option value="Tư thục">Tư thục</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm ngành mới */}
      <Modal
        title="Thêm ngành mới"
        visible={addNganhModalVisible}
        onOk={handleAddNganh}
        onCancel={() => setAddNganhModalVisible(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form
          form={nganhForm}
          layout="vertical"
        >
          <Form.Item
            name="truong_id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ma_nganh"
            label="Mã ngành"
            rules={[{ required: true, message: 'Vui lòng nhập mã ngành' }]}
          >
            <Input placeholder="Nhập mã ngành (ví dụ: 7480201)" />
          </Form.Item>
          <Form.Item
            name="ten_nganh"
            label="Tên ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
          >
            <Input placeholder="Nhập tên ngành đầy đủ" />
          </Form.Item>
          <Form.Item
            name="mo_ta"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả ngành' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết về ngành" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal sửa thông tin ngành */}
      <Modal
        title="Sửa thông tin ngành"
        visible={editNganhModalVisible}
        onOk={handleUpdateNganh}
        onCancel={() => setEditNganhModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form
          form={editNganhForm}
          layout="vertical"
        >
          <Form.Item
            name="truong_id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ma_nganh"
            label="Mã ngành"
            rules={[{ required: true, message: 'Vui lòng nhập mã ngành' }]}
          >
            <Input placeholder="Nhập mã ngành (ví dụ: 7480201)" />
          </Form.Item>
          <Form.Item
            name="ten_nganh"
            label="Tên ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
          >
            <Input placeholder="Nhập tên ngành đầy đủ" />
          </Form.Item>
          <Form.Item
            name="mo_ta"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả ngành' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết về ngành" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal quản lý tổ hợp xét tuyển */}
      <Modal
        title="Quản lý tổ hợp xét tuyển"
        visible={toHopModalVisible}
        onOk={handleUpdateToHop}
        onCancel={() => setToHopModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Chọn các tổ hợp xét tuyển cho ngành {selectedNganh?.ten_nganh}</Text>
        </div>
        
        <Form
          form={toHopForm}
          layout="vertical"
        >
          <Form.Item
            name="ma_to_hop"
            label="Tổ hợp xét tuyển"
          >
            <Select
              mode="multiple"
              placeholder="Chọn tổ hợp xét tuyển"
              style={{ width: '100%' }}
              defaultValue={selectedToHops.map(th => th.ma_to_hop)}
              onChange={handleToHopChange}
              optionLabelProp="label"
            >
              {toHopOptions.map(option => (
                <Option 
                  key={option.ma_to_hop} 
                  value={option.ma_to_hop}
                  label={`${option.ma_to_hop} - ${option.cac_mon}`}
                >
                  <div>
                    {renderToHopTag(option.ma_to_hop)} - {option.cac_mon}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Title level={5}>Tổ hợp đã chọn:</Title>
          <Table
            dataSource={selectedToHops}
            columns={[
              {
                title: 'Mã tổ hợp',
                dataIndex: 'ma_to_hop',
                key: 'ma_to_hop',
                render: text => renderToHopTag(text)
              },
              {
                title: 'Các môn',
                dataIndex: 'cac_mon',
                key: 'cac_mon',
              }
            ]}
            pagination={false}
            size="small"
            rowKey="ma_to_hop"
          />
        </div>
      </Modal>
    </PageContainer>
  );
};

export default SchoolDetail; 