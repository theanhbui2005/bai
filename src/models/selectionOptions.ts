import { useState, useMemo } from 'react';
import { School} from '@/services/selectionOptions/School' ;
import { Major }from '@/services/selectionOptions/Major'; 
import { Combination } from '@/services/selectionOptions/Combination'; 
import db from '@/mock/db.json';

export const useAdmissionModel = () => {
    const [schoolId, setSchoolId] = useState<number | null>(null);
    const [majorId, setMajorId] = useState<number | null>(null);
  
    // Ép kiểu từ JSON snake_case sang interface tương ứng
    const schools: School[] = useMemo(() => db.truong as School[], []);
    const majors: Major[] = useMemo(
      () =>
        schoolId != null
          ? (db.nganh as Major[]).filter(m => m.truong_id === schoolId)
          : [],
      [schoolId]
    );
    const combinations: Combination[] = useMemo(
      () =>
        majorId != null
          ? (db.to_hop_xet_tuyen as Combination[]).filter(c => c.nganh_id === majorId)
          : [],
      [majorId]
    );
  
    const selectSchool = (id: number | null) => {
      setSchoolId(id);
      setMajorId(null);
    };
    const selectMajor = (id: number) => setMajorId(id);
  
    return {
      schools,
      majors,
      combinations,
      schoolId,
      majorId,
      selectSchool,
      selectMajor,
    };
  };
  