import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Typography, Tag, Button, Row, Col, Card, message, Modal, Form, Input, Select, Popconfirm, Space } from 'antd';
import { useModel, history } from 'umi';
import { getAllSchools, TruongType, addSchool, updateSchool, deleteSchool } from '@/services/School';
import { BankOutlined, InfoCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const SchoolManagement: React.FC = () => {
  const { isLoggedIn, checkLoginStatus } = useModel('admin');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<TruongType[]>([]);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedSchool, setSelectedSchool] = useState<TruongType | null>(null);

  // Form
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (!loggedIn) {
      history.push('/admin/login');
    } else {
      fetchData();
    }
  }, []);

  // Lấy dữ liệu trường
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSchools();
      if (result.success) {
        setDataSource(result.data);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu trường');
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết trường
  const viewSchoolDetail = (record: TruongType) => {
    history.push(`/admin/schools/${record.id}`);
  };

  // Mở modal thêm trường
  const openAddModal = () => {
    form.resetFields();
    setAddModalVisible(true);
  };

  // Mở modal sửa trường
  const openEditModal = (record: TruongType) => {
    setSelectedSchool(record);
    editForm.setFieldsValue(record);
    setEditModalVisible(true);
  };

  // Thêm trường mới
  const handleAddSchool = async () => {
    try {
      const values = await form.validateFields();
      const result = await addSchool(values);
      
      if (result.success) {
        message.success(result.message);
        setAddModalVisible(false);
        fetchData();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  // Cập nhật thông tin trường
  const handleUpdateSchool = async () => {
    if (!selectedSchool) return;
    
    try {
      const values = await editForm.validateFields();
      const result = await updateSchool(selectedSchool.id, values);
      
      if (result.success) {
        message.success(result.message);
        setEditModalVisible(false);
        fetchData();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  // Xóa trường
  const handleDeleteSchool = async (id: number) => {
    try {
      const result = await deleteSchool(id);
      
      if (result.success) {
        message.success(result.message);
        fetchData();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể xóa trường');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: 'Mã trường',
      dataIndex: 'ma_truong',
      key: 'ma_truong',
      width: '10%',
    },
    {
      title: 'Tên trường',
      dataIndex: 'ten_truong',
      key: 'ten_truong',
      width: '25%',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'dia_chi',
      key: 'dia_chi',
      width: '35%',
    },
    {
      title: 'Loại trường',
      dataIndex: 'loai_truong',
      key: 'loai_truong',
      width: '10%',
      render: (text: string) => (
        <Tag color={text === 'Công lập' ? 'blue' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      render: (text: any, record: TruongType) => (
        <Space>
          <Button
            type="primary"
            icon={<InfoCircleOutlined />}
            onClick={() => viewSchoolDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trường này?"
            onConfirm={() => handleDeleteSchool(record.id)}
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
      ),
    },
  ];

  return (
    <PageContainer
      title="Danh sách các trường đại học"
      subTitle="Hiển thị thông tin các trường đại học trong hệ thống"
      extra={[
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
        >
          Thêm trường mới
        </Button>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={2}>Danh sách các trường đại học</Title>
            <Paragraph>Hiển thị thông tin các trường đại học trong hệ thống</Paragraph>

            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              bordered
            />
          </Card>
        </Col>
      </Row>

      {/* Modal thêm trường mới */}
      <Modal
        title="Thêm trường mới"
        visible={addModalVisible}
        onOk={handleAddSchool}
        onCancel={() => setAddModalVisible(false)}
        okText="Thêm"
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
          form={editForm}
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
    </PageContainer>
  );
};

export default SchoolManagement; 