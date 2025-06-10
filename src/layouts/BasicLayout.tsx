import { Layout } from 'antd';
import React from 'react';
import { Link } from 'umi';

const { Header, Content } = Layout;

const BasicLayout: React.FC = ({ children }) => {
  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Link to="/">Tuyển sinh trực tuyến</Link>
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default BasicLayout;
