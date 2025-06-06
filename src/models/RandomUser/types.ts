export interface Record {
  id: string;
  name: string;
  email: string;
  gender: string;
  // Add other fields as needed
}

export interface UseRandomUserModel {
  data: Record[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
  row?: Record;
  setRow: (row?: Record) => void;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  setData: (data: Record[]) => void;
  getDataUser: () => Promise<void>;
}
