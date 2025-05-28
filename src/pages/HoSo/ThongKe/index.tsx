import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ThongKeHoSo = () => {
  const [groupByTrangThai, setGroupByTrangThai] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/ho_so')
      .then(res => res.json())
      .then((res) => {
        // Gom nhóm theo trạng thái
        const grouped = res.reduce((acc: any[], curr: any) => {
          const found = acc.find(item => item.trangThai === curr.trang_thai);
          if (found) found.soLuong += 1;
          else acc.push({ trangThai: curr.trang_thai, soLuong: 1 });
          return acc;
        }, []);
        setGroupByTrangThai(grouped);
      });
  }, []);

  return (
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
};

export default ThongKeHoSo;