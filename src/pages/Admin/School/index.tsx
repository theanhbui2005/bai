import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Typography, Tag, Button, Row, Col, Card, message } from 'antd';
import { useModel, history } from 'umi';
import { getAllSchools, TruongType } from '@/services/School';
import { BankOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SchoolManagement: React.FC = () => {
  const { isLoggedIn, checkLoginStatus } = useModel('admin');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<TruongType[]>([]);

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
      width: '30%',
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
      width: '10%',
      render: (text: any, record: TruongType) => (
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={() => viewSchoolDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title="Danh sách các trường đại học"
      subTitle="Hiển thị thông tin các trường đại học trong hệ thống"
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
    </PageContainer>
  );
};

export default SchoolManagement; 