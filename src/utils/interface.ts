export interface IProjectItem {
  id: number;
  name: string;
  nameExtensions: string[];
  nameRegExp: string;
  nameRegDesc: string;
  due: string;
  adminName: string;
  createAt: string;
  updateAt: string;
}
export interface IProjectItemOwn {
  id: number;
  name: string;
  nameExtensions: string[];
  nameRegExp: string;
  nameRegDesc: string;
  due: string;
  adminName: string;
  createAt: string;
  updateAt: string;
}

export interface IAdminBasicInfo {
  projectsCount: number;
  filesCount: number;
  memoryUsed: number;
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
