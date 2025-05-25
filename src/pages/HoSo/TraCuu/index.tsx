import React, { useState } from 'react';
import { Input, Table } from 'antd';

const mockKetQua = [
  { maHoSo: 'HS001', hoTen: 'Nguyễn Văn A', trangThai: 'Đã duyệt', ghiChu: '' },
  { maHoSo: 'HS002', hoTen: 'Trần Thị B', trangThai: 'Chờ duyệt', ghiChu: '' },
];

const TraCuuHoSo = () => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<any[]>([]);

  const handleSearch = (value: string) => {
    setData(
      mockKetQua.filter(
        hs =>
          hs.maHoSo.toLowerCase().includes(value.toLowerCase()) ||
          hs.hoTen.toLowerCase().includes(value.toLowerCase()),
      ),
    );
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
        columns={[
          { title: 'Mã hồ sơ', dataIndex: 'maHoSo' },
          { title: 'Họ tên', dataIndex: 'hoTen' },
          { title: 'Trạng thái', dataIndex: 'trangThai' },
          { title: 'Ghi chú', dataIndex: 'ghiChu' },
        ]}
        rowKey="maHoSo"
      />
    </div>
  );
};

export default TraCuuHoSo;