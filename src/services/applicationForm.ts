import { School, Major, SubjectGroup, SelectOption } from '@/types/application';

export const transformSchoolsToOptions = (schools: School[]): SelectOption[] => {
  return schools.map(school => ({
    label: `${school.ma_truong} - ${school.ten_truong}`,
    value: school.id
  }));
};

export const transformMajorsToOptions = (majors: Major[]): SelectOption[] => {
  return majors.map(major => ({
    label: `${major.ma_nganh} - ${major.ten_nganh}`,
    value: major.id
  }));
};

export const transformSubjectGroupsToOptions = (groups: SubjectGroup[]): SelectOption[] => {
  return groups.map(group => ({
    label: `${group.ma_to_hop} (${group.cac_mon})`,
    value: group.id
  }));
};

export const validateMajorsBySchool = (majors: Major[], schoolId: number): Major[] => {
  return majors.filter(major => major.truong_id === schoolId);
};

export const validateSubjectGroupsByMajor = (groups: SubjectGroup[], majorId: number): SubjectGroup[] => {
  return groups.filter(group => group.nganh_id === majorId);
};
