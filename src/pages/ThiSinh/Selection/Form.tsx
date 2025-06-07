import React from 'react';
import { Select, Typography, Card, Button, notification } from 'antd';
import { useAdmissionModel } from '@/models/selectionOptions';

const { Title } = Typography;
const { Option } = Select;

interface SelectionFormProps {
  onComplete: (school: any, major: any, combinations: any[]) => void;
}

const SelectionForm: React.FC<SelectionFormProps> = ({ onComplete }) => {
  const {
    schools,
    majors,
    combinations,
    schoolId,
    majorId,
    selectSchool,
    selectMajor,
  } = useAdmissionModel();

  const handleSubmit = () => {
    if (schoolId && majorId) {
      const selectedSchool = schools.find(s => s.id === schoolId);
      const selectedMajor = majors.find(m => m.id === majorId);
      const selectedCombinations = combinations.map(c => c.cac_mon).join(', ');

      console.log('Đăng ký thành công:', {
        trường: selectedSchool?.ten_truong,
        ngành: selectedMajor?.ten_nganh,
        tổ_hợp: selectedCombinations,
      });

      onComplete(selectedSchool, selectedMajor, combinations);

      // Optional: lưu vào localStorage
      localStorage.setItem(
        'admission',
        JSON.stringify({
          schoolId,
          majorId,
          combinationIds: combinations.map(c => c.id),
        })
      );
    }
    notification.success({
      message: 'Đăng ký thành công',
      description: 'Bạn đã đăng ký thành công vào hệ thống.',
      placement: 'topRight',
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Hệ thống quản lý Tuyển sinh Đại học Trực tuyến</Title>

      <Card title="1. Chọn trường">
        <Select
          placeholder="Chọn trường"
          style={{ width: '100%' }}
          value={schoolId ?? undefined}
          onChange={selectSchool}
        >
          {schools.map((school) => (
            <Option key={school.id} value={school.id}>
              {school.ten_truong}
            </Option>
          ))}
        </Select>
      </Card>

      {schoolId && (
        <Card title="2. Chọn ngành" style={{ marginTop: 16 }}>
          <Select
            placeholder="Chọn ngành"
            style={{ width: '100%' }}
            value={majorId ?? undefined}
            onChange={selectMajor}
          >
            {majors.map((major) => (
              <Option key={major.id} value={major.id}>
                {major.ten_nganh}
              </Option>
            ))}
          </Select>
        </Card>
      )}

      {majorId && (
  <Card title="3. Các tổ hợp xét tuyển" style={{ marginTop: 16 }}>
    <ul>
      {combinations.map((comb) => (
        <li key={comb.id}>
          <strong>{comb.ma_to_hop}</strong>: {comb.cac_mon}
        </li>
      ))}
    </ul>
  </Card>
)}

      {majorId && (
        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleSubmit}>
            Xác nhận đăng ký

          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectionForm;