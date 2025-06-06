import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import SelectionForm from './Form';

const SelectionPage: React.FC = () => {
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
        <SelectionForm />
      </div>
    </PageContainer>
  );
};

export default SelectionPage;
