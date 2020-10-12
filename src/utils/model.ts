import { instance, memorize } from "./request";

// TODO 目前对于memorize的使用还有点问题，没办法有效地判断信息的有效性

interface IRequestAdminLogin {
  email: string;
  password: string;
}

// admin
export const requestAdminLogin = ({ email, password }: IRequestAdminLogin) =>
  instance.post("/admin/login", { email, password });

interface IRequestAdminRegister {
  email: string;
  password: string;
  name: string;
  invitationCode: string;
}

export const requestAdminRegister = ({
  email,
  password,
  invitationCode,
  name,
}: IRequestAdminRegister) =>
  instance.post("/admin/register", { email, password, invitationCode, name });

export const requestAdminStatus = () => instance.get("/admin/status");

interface IRequestAdminInvitationCode {
  email: string;
}

export const requestAdminInvitationCode = ({
  email,
}: IRequestAdminInvitationCode) =>
  instance.post("/admin/invitationCode", { email });

// project
export const requestProjectList = () => instance.get("/project/");

export const requestProjectOwn = () => instance.get("/project/own");

interface IRequestProjectInsert {
  name: string;
  fileNamePattern: string;
  fileNameExtensions: string[];
  fileNameExample: string;
}

export const requestProjectInsert = ({
  fileNameExample,
  fileNameExtensions,
  fileNamePattern,
  name,
}: IRequestProjectInsert) =>
  instance.post("/project/insert", {
    name,
    fileNamePattern,
    fileNameExtensions,
    fileNameExample,
  });

interface IRequestProjectUpdate {
  id: string;
  usable: boolean;
  fileNamePattern: string;
  fileNameExtensions: string[];
  fileNameExample: string;
  sendEmail: boolean;
  visible: boolean;
}

export const requestProjectUpdate = ({
  fileNameExample,
  fileNameExtensions,
  fileNamePattern,
  id,
  usable,
  sendEmail,
  visible,
}: IRequestProjectUpdate) =>
  instance.post("/project/update", {
    id,
    usable,
    fileNamePattern,
    fileNameExtensions,
    fileNameExample,
    sendEmail,
    visible,
  });

interface IRequestProjectDelete {
  id: string;
}
export const requestProjectDelete = ({ id }: IRequestProjectDelete) =>
  instance.post("/project/delete", { id });

interface IRequestProjectRestore {
  id: string;
}
export const requestProjectRestore = ({ id }: IRequestProjectRestore) =>
  instance.post("/project/restore", { id });

// storage

interface IRequestStorageFileList {
  id: string;
}

export const requestStorageFileList = ({ id }: IRequestStorageFileList) =>
  instance.get(`/storage/fileList?id=${id}`);

interface IRequestStorageFileCount {
  id: string;
}

export const requestStorageFileCount = ({ id }: IRequestStorageFileCount) =>
  instance.get(`/storage/fileCount?id=${id}`);

interface IRequestStorageDownload {
  id: string;
  onDownloadProgress: (progressEvent: any) => void;
}

export const requestStorageDownload = ({
  id,
  onDownloadProgress,
}: IRequestStorageDownload) =>
  instance.get(`/storage/download?id=${id}`, {
    responseType: "blob",
    onDownloadProgress,
  });

export const requestStorageUpload = ({ file, secret, projectId }) => {
  const form = new FormData();
  form.append("secret", secret);
  form.append("projectId", projectId);
  form.append("file", file);
  return instance.post("/storage/upload", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
