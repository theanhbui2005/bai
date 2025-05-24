// src/pages/index.tsx
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout'; // nếu bạn dùng ProLayout
import FormAdmission from './Form'; // import đúng file Form.tsx của bạn

const IndexPage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: 'Hệ thống quản lý Tuyển sinh Đại học Trực tuyến',
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Trang chủ' },
            { path: '', breadcrumbName: 'Đăng ký tuyển sinh' },
          ],
        },
      }}
      content="Vui lòng điền đầy đủ thông tin và chọn trường → ngành → tổ hợp xét tuyển"
    >
      <div style={{ marginTop: 24 }}>
        <FormAdmission />
      </div>
    </PageContainer>
  );
};

export default IndexPage;
