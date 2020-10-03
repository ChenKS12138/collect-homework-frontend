export interface IProjectItem {
  id: string;
  name: string;
  adminId: string;
  adminName: string;
  fileNamePattern: string;
  fileNameExtensions: string[];
  fileNameExample: string;
  usable: boolean;
  createAt: string;
  updateAt: string;
}

export interface IAdminBasicInfo {
  projectCount: number;
  fileCount: number;
  totalSize: number;
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
