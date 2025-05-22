import React, { useState, useEffect } from 'react';
import { useParams, history, useModel } from 'umi';
import { Card, Typography, Spin, Row, Col, Tag, Divider } from 'antd';
import { BankOutlined, ReadOutlined, BookOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { getSchoolById } from '@/services/School';
import { getNganhByTruongId, getToHopByNganhId, NganhType, ToHopType } from '@/services/Nganh';

const { Title, Text, Paragraph } = Typography;

// Interface cho dữ liệu tổng hợp: ngành và tổ hợp xét tuyển của ngành đó
interface NganhVaToHopType extends NganhType {
  to_hop_xet_tuyen: ToHopType[];
}

const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, checkLoginStatus } = useModel('admin');
  const [loading, setLoading] = useState<boolean>(true);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [nganhData, setNganhData] = useState<NganhVaToHopType[]>([]);

  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (!loggedIn) {
      history.push('/admin/login');
      return;
    }

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

    fetchSchoolData();
  }, [id]);

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
    const colors = {
      'A00': 'magenta',
      'A01': 'red',
      'B00': 'volcano',
      'C00': 'orange',
      'D01': 'gold',
      'D07': 'lime',
      'D14': 'green',
    };
    
    return <Tag color={colors[maToHop as keyof typeof colors] || 'blue'}>{maToHop}</Tag>;
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
        </Title>
      </Divider>

      <Row gutter={[16, 16]}>
        {nganhData.map((nganh) => (
          <Col xs={24} key={nganh.id}>
            <Card
              title={
                <span>
                  <BookOutlined /> {nganh.ten_nganh}
                </span>
              }
              bordered={true}
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
                    {nganh.to_hop_xet_tuyen.map((toHop) => (
                      <div key={toHop.id} style={{ marginBottom: 8 }}>
                        {renderToHopTag(toHop.ma_to_hop)} - <Text>{toHop.cac_mon}</Text>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default SchoolDetail; 