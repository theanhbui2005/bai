import React, { useState } from 'react';
import { Input, Table } from 'antd';

const TraCuuHoSo = () => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/ho_so').then(r => r.json());
      // Kiểm tra dữ liệu trả về
      // console.log(res);
      const filtered = res.filter(
        (hs: any) =>
          (hs.ho_ten || '').toLowerCase().includes(value.toLowerCase()) ||
          (hs.id ? hs.id.toString() : '').includes(value)
      );
      setData(filtered);
    } catch (error) {
      setData([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Tra cứu kết quả hồ sơ</h2>
      <Input.Search
        placeholder="Nhập mã hồ sơ hoặc họ tên"
        enterButton="Tìm kiếm"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onSearch={handleSearch}
        style={{ width: 400, marginBottom: 16 }}
      />
      <Table
        dataSource={data}
        loading={loading}
        columns={[
          { title: 'Mã hồ sơ', dataIndex: 'id' },
          { title: 'Họ tên', dataIndex: 'ho_ten' },
          { title: 'Trạng thái', dataIndex: 'trang_thai' },
          { title: 'Ghi chú', dataIndex: 'ghi_chu' },
        ]}
        rowKey="id"
      />
    </div>
  );
};

export default TraCuuHoSo;