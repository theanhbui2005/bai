import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import SelectionForm from './Form';
import type { School } from '@/services/types/School';
import type { Major } from '@/services/types/Major';
import type { Combination } from '@/services/types/Combination';

const SelectionPage: React.FC = () => {
  const handleComplete = (school: School, major: Major, combinations: Combination[]) => {
    // Handle the completion here
    console.log('Selection completed:', { school, major, combinations });
    // You can add navigation or other logic here
  };

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
        <SelectionForm onComplete={handleComplete} />
      </div>
    </PageContainer>
  );
};

export default SelectionPage;
