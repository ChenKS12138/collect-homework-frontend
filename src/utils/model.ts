import { instance, memorize } from "./request";

// TODO 目前对于memorize的使用还有点问题，没办法有效地判断信息的有效性

interface IRequestAdminLogin {
  email: string;
  password: string;
  captcha: string;
  captchaToken: string;
}

// admin
export const requestAdminLogin = ({
  email,
  password,
  captcha,
  captchaToken,
}: IRequestAdminLogin) =>
  instance.post("/admin/login", { email, password, captcha, captchaToken });

interface IRequestAdminRegister {
  email: string;
  password: string;
  name: string;
  invitationCode: string;
  captcha: string;
  captchaToken: string;
}

export const requestAdminRegister = ({
  email,
  password,
  invitationCode,
  name,
  captcha,
  captchaToken,
}: IRequestAdminRegister) =>
  instance.post("/admin/register", {
    email,
    password,
    invitationCode,
    name,
    captcha,
    captchaToken,
  });

export const requestAdminStatus = () => instance.get("/admin/status");

interface IRequestAdminInvitationCode {
  email: string;
  captcha: string;
  captchaToken: string;
}

export const requestAdminInvitationCode = ({
  email,
  captcha,
  captchaToken,
}: IRequestAdminInvitationCode) =>
  instance.post("/admin/invitationCode", { email, captcha, captchaToken });

// project
export const requestProjectList = () => instance.get("/project/");

export const requestProjectOwn = () => instance.get("/project/own");

interface IRequestProjectInsert {
  name: string;
  fileNamePattern: string;
  fileNameExtensions: string[];
  fileNameExample: string;
  labels: string[];
}

export const requestProjectInsert = ({
  fileNameExample,
  fileNameExtensions,
  fileNamePattern,
  name,
  labels,
}: IRequestProjectInsert) =>
  instance.post("/project/insert", {
    name,
    fileNamePattern,
    fileNameExtensions,
    fileNameExample,
    labels,
  });

interface IRequestProjectUpdate {
  id: string;
  usable: boolean;
  fileNamePattern: string;
  fileNameExtensions: string[];
  fileNameExample: string;
  labels: string[];
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
  labels,
}: IRequestProjectUpdate) =>
  instance.post("/project/update", {
    id,
    usable,
    fileNamePattern,
    fileNameExtensions,
    fileNameExample,
    sendEmail,
    visible,
    labels,
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

interface IRequestStorageProjectSize {
  id: string;
}

export const requestStorageProjectSize = ({ id }: IRequestStorageProjectSize) =>
  instance.get(`/storage/projectSize?id=${id}`);

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

interface IRequestStorageUpload {
  file: any;
  secret: string;
  projectId: string;
}

export const requestStorageUpload = ({
  file,
  secret,
  projectId,
}: IRequestStorageUpload) => {
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

interface IRequestSubToken {
  expire: number;
  authCode: number;
}

export const requestSubToken = ({ expire, authCode }: IRequestSubToken) =>
  instance.post(`/admin/subToken`, { expire, authCode });

interface IRequestProjectFileList {
  id: string;
}

export const requestProjectFileList = ({ id }: IRequestProjectFileList) =>
  instance.get(`/project/fileList?id=${id}`);

export const requestCommonGenerateCaptcha = () =>
  instance.get(`/common/generateCaptcha`, {
    responseType: "blob",
  });

interface IRequestStorageDownloadSelectively {
  id: string;
  code: string;
  onDownloadProgress: (progressEvent: any) => void;
}

export const requestStorageDownloadSeletively = ({
  id,
  code,
  onDownloadProgress,
}: IRequestStorageDownloadSelectively) =>
  instance.get(`/storage/downloadSelectively?id=${id}&code=${code}`, {
    responseType: "blob",
    onDownloadProgress,
  });
