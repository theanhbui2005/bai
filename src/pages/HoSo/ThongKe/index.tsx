import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const thongKeHoSo = [
  { truong: 'ĐH A', nganh: 'CNTT', trangThai: 'Đã duyệt', soLuong: 120 },
  { truong: 'ĐH A', nganh: 'Kinh tế', trangThai: 'Chờ duyệt', soLuong: 80 },
  { truong: 'ĐH B', nganh: 'CNTT', trangThai: 'Đã duyệt', soLuong: 60 },
  { truong: 'ĐH B', nganh: 'Kinh tế', trangThai: 'Từ chối', soLuong: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const groupByTrangThai = thongKeHoSo.reduce((acc, curr) => {
  const found = acc.find(item => item.trangThai === curr.trangThai);
  if (found) found.soLuong += curr.soLuong;
  else acc.push({ trangThai: curr.trangThai, soLuong: curr.soLuong });
  return acc;
}, [] as { trangThai: string; soLuong: number }[]);

const ThongKeHoSo = () => (
  <div>
    <h2>Thống kê hồ sơ theo trạng thái</h2>
    <BarChart width={600} height={300} data={groupByTrangThai}>
      <XAxis dataKey="trangThai" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="soLuong" fill="#8884d8" />
    </BarChart>
    <h2>Biểu đồ Donut trạng thái hồ sơ</h2>
    <PieChart width={400} height={300}>
      <Pie
        data={groupByTrangThai}
        dataKey="soLuong"
        nameKey="trangThai"
        cx="50%"
        cy="50%"
        outerRadius={80}
        innerRadius={40}
        label
      >
        {groupByTrangThai.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
);

export default ThongKeHoSo;