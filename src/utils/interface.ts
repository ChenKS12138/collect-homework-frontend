export interface IProjectItem {
  id: string;
  name: string;
  adminId: string;
  adminName: string;
  fileNamePattern: string;
  fileNameExtensions: string[];
  fileNameExample: string;
  usable: boolean;
  visible: boolean;
  sendEmail: boolean;
  createAt: string;
  updateAt: string;
}

export interface IAdminBasicInfo {
  projectCount: number;
  fileCount: number;
  totalSize: number;
  username: string;
  email: string;
}

export interface IProjectFile {
  id: string;
  fileName: string;
  createAt: string;
  size: string;
}

type StdError = Error;

export interface StdResponse<TStdResponse = any> {
  data: TStdResponse;
  reason: StdError;
}
